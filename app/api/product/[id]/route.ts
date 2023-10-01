import ProductEntity, { ProductDocument } from "@/entities/product-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _: NextRequest,
  context: { params: { id: string } },
): Promise<NextResponse> => {
  try {
    const { id } = context.params;
    await connectDB();
    const products: ProductDocument[] = await ProductEntity.find({
      category: id,
    }).exec();
    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
