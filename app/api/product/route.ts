import CategoryEntity from "@/entities/category-entity";
import ProductEntity, { ProductDocument } from "@/entities/product-entity";
import connectDB from "@/lib/db";
import { isValidToken } from "@/services/jwt-service";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { name, price, description, image, categoryId, token } =
      await req.json();
    await connectDB();

    const validation = await validatePostRequest(
      name,
      price,
      description,
      image,
      categoryId,
      token,
    );
    if (validation) return validation;

    await ProductEntity.create<ProductDocument>({
      name,
      price,
      description,
      image,
      category: categoryId,
    });

    return NextResponse.json({}, { status: 201 });
  } catch (error: any) {
    console.error("Error when creating a product", error);
    return NextResponse.json({}, { status: 500 });
  }
};

/* ######################################## HELPER FUNCTIONS ######################################## */

const validatePostRequest = async (
  name: string,
  price: number,
  description: string,
  image: string,
  categoryId: string,
  token: string,
): Promise<NextResponse | null> => {
  if (!name || !price || !description || !image || !categoryId) {
    console.error("Cannot create a product without name, price or description");
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
  if (!(await CategoryEntity.findById(categoryId))) {
    console.error("Category not found");
    return NextResponse.json({}, { status: 500 });
  }
  return null;
};
