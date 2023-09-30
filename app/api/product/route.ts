import ProductEntity from "@/entities/product-entity";
import connectDB from "@/lib/db";
import { isValidToken } from "@/services/jwt-service";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { name, price, description, token } = await req.json();
    if (!name || !price || !description) {
      console.error(
        "Cannot create a product without name, price or description",
      );
      return NextResponse.json({}, { status: 400 });
    }
    if (!isValidToken(token)) {
      console.error("Invalid token");
      return NextResponse.json({}, { status: 401 });
    }
    if (await ProductEntity.findOne({ name })) {
      console.error("Product already exists");
      return NextResponse.json({}, { status: 409 });
    }
    await connectDB();
    await ProductEntity.create({
      name,
      price,
      description,
    });
    return NextResponse.json({}, { status: 201 });
  } catch (error: any) {
    console.error("Error when creating a product", error);
    return NextResponse.json({}, { status: 500 });
  }
};
