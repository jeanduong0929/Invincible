import connectDB from "@/lib/db";
import CartItemEntity from "@/entities/cart-item-entity";
import { NextRequest, NextResponse } from "next/server";
import { isValidToken } from "@/services/jwt-service";

export const DELETE = async (
  req: NextRequest,
  context: { params: { id: string } },
) => {
  try {
    // Get the product id and token from the request
    const { id } = context.params;
    const token = req.headers.get("token") as string;

    // Validate the request
    const validation = validateDeleteRequest(id, token);
    if (validation) {
      return validation;
    }

    await connectDB();

    const existingCartItem = await CartItemEntity.findById(id);

    if (!existingCartItem) {
      console.error("Cart item not found");
      return NextResponse.json({}, { status: 404 });
    }

    await CartItemEntity.findByIdAndDelete(id);

    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    console.error("Error when deleting cart item", error);
    return NextResponse.json({}, { status: 500 });
  }
};

/* ######################################## HELPER FUNCTIONS ######################################## */

const validateDeleteRequest = (
  productId: string,
  token: string,
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
