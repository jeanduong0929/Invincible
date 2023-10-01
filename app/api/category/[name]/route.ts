import CategoryEntity, { CategoryDocument } from "@/entities/category-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _: NextRequest,
  context: { params: { name: string } },
): Promise<NextResponse> => {
  try {
    const { name } = context.params;
    await connectDB();
    const category: CategoryDocument | null = await CategoryEntity.findOne({
      name,
    });
    return NextResponse.json(category, { status: 200 });
  } catch (error: any) {
    console.error("Error when fetching product by name", error);
    return NextResponse.json({}, { status: 500 });
  }
};
