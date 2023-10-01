import CategoryEntity, { CategoryDocument } from "@/entities/category-entity";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { isValidToken } from "@/services/jwt-service";

export const GET = async (): Promise<NextResponse> => {
  try {
    await connectDB();
    const categories: CategoryDocument[] = await CategoryEntity.find();
    const rearranged = rearrangeCategories(categories);
    console.log("Categories", rearranged);
    return NextResponse.json(rearranged, { status: 200 });
  } catch (error: any) {
    console.error("Error when getting categories", error);
    return NextResponse.json({}, { status: 500 });
  }
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { name, token } = await req.json();
    await connectDB();

    const validation = await validatePostRequest(name, token);
    if (validation) return validation;

    await CategoryEntity.create<CategoryDocument>({
      name,
    });

    return NextResponse.json({}, { status: 201 });
  } catch (error: any) {
    console.error("Error when creating a category", error);
    return NextResponse.json({}, { status: 500 });
  }
};

/* ######################################## HELPER FUNCTIONS ######################################## */

const validatePostRequest = async (
  name: string,
  token: string,
): Promise<NextResponse | null> => {
  if (!name || !token) {
    console.error("Missing name or token");
    return NextResponse.json({}, { status: 400 });
  }
  if (!isValidToken(token)) {
    console.error("Invalid token");
    return NextResponse.json({}, { status: 401 });
  }
  if (await CategoryEntity.findOne({ name })) {
    console.error("Category already exists");
    return NextResponse.json({}, { status: 409 });
  }
  return null;
};

const rearrangeCategories = (
  categories: CategoryDocument[],
): CategoryDocument[] => {
  const rearranged: CategoryDocument[] = [];

  categories.forEach((category: CategoryDocument) => {
    switch (category.name) {
      case "basics":
        rearranged[0] = category;
        break;
      case "tops":
        rearranged[1] = category;
        break;
      case "bottoms":
        rearranged[2] = category;
        break;
      default:
        break;
    }
  });

  return rearranged;
};
