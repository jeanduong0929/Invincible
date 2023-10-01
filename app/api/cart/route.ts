import CartEntity, { CartDocument } from "@/entities/cart-entity";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { getDecodedToken, isValidToken } from "@/services/jwt-service";
import CartItemEntity from "@/entities/cart-item-entity";

interface DecodedToken extends JwtPayload {
  _id: string;
  email: string;
}

export const POST = async (req: NextRequest) => {
  try {
    const { productId, token } = await req.json();

    const validation = validatePostRequest(productId, token);
    if (validation) {
      return validation;
    }

    const { _id } = getDecodedToken(token) as DecodedToken;
    const myCart = await getCart(_id);

    await CartItemEntity.create({
      cart: myCart._id,
      product: productId,
    });

    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    console.error("Error when adding to cart", error);
    return NextResponse.json({}, { status: 500 });
  }
};

/* ######################################## HELPER FUNCTIONS ######################################## */

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
