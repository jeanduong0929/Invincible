import connectDB from "@/lib/db";
import ProductEntity from "@/entities/product-entity";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import CartEntity, { CartDocument } from "@/entities/cart-entity";
import CartItemEntity, { CartItemDocument } from "@/entities/cart-item-entity";
import { getDecodedToken, isValidToken } from "@/services/jwt-service";

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

    // Connect to the database
    await connectDB();

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

    // Validate the request
    const validation = validatePostRequest(productId, token);
    if (validation) {
      return validation;
    }

    // Connect to the database
    await connectDB();

    // Decode the user id from the token
    const { _id } = getDecodedToken(token) as DecodedToken;

    // Get the product
    const foundProduct = await ProductEntity.findById(productId);

    // Get the user cart
    const myCart = await getCart(_id);

    // Get the existing cart item
    const existingCartItem = await CartItemEntity.findOne({
      name: foundProduct.name,
      cart: myCart._id,
    });

    // If the cart item already exists, update the quantity else create a new cart item
    if (existingCartItem) {
      existingCartItem.quantity += 1;
      existingCartItem.price *= existingCartItem.quantity;
      await CartItemEntity.findByIdAndUpdate(existingCartItem._id, {
        quantity: existingCartItem.quantity,
        price: existingCartItem.price,
      });
    } else {
      await CartItemEntity.create({
        name: foundProduct.name,
        price: foundProduct.price,
        quantity: 1,
        description: foundProduct.description,
        image: foundProduct.image,
        cart: myCart._id,
      });
    }

    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    console.error("Error when adding to cart", error);
    return NextResponse.json({}, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    // Get the request body
    const { id, add, minus } = await req.json();
    const token = req.headers.get("token") as string;

    // Validate the request
    const validation = validatePatchRequest(id, add, minus, token);
    if (validation) {
      return validation;
    }

    // Connect to the database
    await connectDB();

    // Get the cart item
    const foundCartItem = await CartItemEntity.findById(id);

    // Update the cart item
    if (add) {
      // If add is true, increment the quantity by 1
      await CartItemEntity.updateOne({
        quantity: foundCartItem!.quantity + 1,
      });
    } else if (minus) {
      // If minus is true, decrement the quantity by 1 only if the quantity is greater than 1
      await CartItemEntity.updateOne({
        quantity: foundCartItem.quantity > 1 ? foundCartItem.quantity - 1 : 1,
      });
    }

    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    console.error("Error when updating cart", error);
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

const validatePatchRequest = (
  id: string,
  add: boolean,
  minus: boolean,
  token: string
): NextResponse | null => {
  console.log("Id: ", id);
  console.log("Add: ", add);
  console.log("Minus: ", minus);
  console.log("Token: ", token);

  if (!id || !token) {
    console.error("Missing id, add, minus or token");
    return NextResponse.json({}, { status: 400 });
  }
  if (!isValidToken(token)) {
    console.error("Invalid token");
    return NextResponse.json({}, { status: 401 });
  }
  return null;
};
