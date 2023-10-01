import CartItemEntity, { CartItemDocument } from "@/entities/cart-item-entity";
import { JwtPayload } from "jsonwebtoken";
import CartEntity, { CartDocument } from "@/entities/cart-entity";
import { NextRequest, NextResponse } from "next/server";
import { getDecodedToken, isValidToken } from "@/services/jwt-service";
import ProductEntity from "@/entities/product-entity";

interface DecodedToken extends JwtPayload {
  _id: string;
  email: string;
}

export const GET = async (req: NextRequest) => {
  try {
    const token = req.headers.get("token") as string;

    const validation = validateGetRequest(token);
    if (validation) {
      return validation;
    }

    // Decode the user from the token
    const decodedToken: DecodedToken = getDecodedToken(token) as DecodedToken;

    // Get the user cart
    const myCart: CartDocument | null = await CartEntity.findOne({
      user: decodedToken._id,
    });

    // Get the cart items
    const cartItems: CartItemDocument[] | null = await CartItemEntity.find({
      cart: myCart!._id,
    }).exec();
    return NextResponse.json(cartItems, { status: 200 });
  } catch (error: any) {
    console.error("Error when getting cart", error);
    return NextResponse.json({}, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const { productId } = await req.json();
    const token = req.headers.get("token") as string;

    const validation = validatePostRequest(productId, token);
    if (validation) {
      return validation;
    }

    const { _id } = getDecodedToken(token) as DecodedToken;
    const foundProduct = await ProductEntity.findById(productId);
    const myCart = await getCart(_id);

    await CartItemEntity.create({
      name: foundProduct.name,
      price: foundProduct.price,
      description: foundProduct.description,
      image: foundProduct.image,
      cart: myCart._id,
    });

    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    console.error("Error when adding to cart", error);
    return NextResponse.json({}, { status: 500 });
  }
};

/* ######################################## HELPER FUNCTIONS ######################################## */

const validateGetRequest = (token: string): NextResponse | null => {
  if (!token) {
    console.error("Missing token");
    return NextResponse.json({}, { status: 400 });
  }
  if (!isValidToken(token)) {
    console.error("Invalid token");
    return NextResponse.json({}, { status: 401 });
  }
  return null;
};

const validatePostRequest = (
  productId: string,
  token: string
): NextResponse | null => {
  if (!productId || !token) {
    console.error("Missing productId or token");
    return NextResponse.json({}, { status: 400 });
  }
  if (!isValidToken(token)) {
    console.error("Invalid token");
    return NextResponse.json({}, { status: 401 });
  }
  return null;
};

const getCart = async (_id: string): Promise<CartDocument> => {
  const existingCart = await CartEntity.findOne({ user: _id });
  if (!existingCart) {
    const newCart = await CartEntity.create({
      user: _id,
    });
    return newCart;
  }
  return existingCart;
};
