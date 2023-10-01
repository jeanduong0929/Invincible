import ProductEntity, { ProductDocument } from "@/entities/product-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _: NextRequest,
  context: { params: { name: string } },
) => {
  try {
    const { name } = context.params;

    const validation = validateGetRequest(name);
    if (validation) return validation;

    await connectDB();

    const existingProduct: ProductDocument | null = await ProductEntity.findOne(
      {
        name: name,
      },
    );
    return NextResponse.json(existingProduct, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

/* ######################################## HELPER FUNCTIONS ######################################## */

const validateGetRequest = (name: string): NextResponse | null => {
  if (!name) {
    console.error("Name is required");
    return NextResponse.json({}, { status: 400 });
  }
  return null;
};
