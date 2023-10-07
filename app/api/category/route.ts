import connectDB from "@/lib/db";
import { isValidToken } from "@/services/jwt-service";
import { NextRequest, NextResponse } from "next/server";
import CategoryEntity, { CategoryDocument } from "@/entities/category-entity";

/**
 * @async
 * @function GET
 * @description Retrieves and rearranges categories.
 * @returns {Promise<NextResponse>} The server response containing the rearranged categories.
 */
export const GET = async (): Promise<NextResponse> => {
  try {
    await connectDB();
    const categories: CategoryDocument[] = await CategoryEntity.find();
    const rearranged = rearrangeCategories(categories);
    return NextResponse.json(rearranged, { status: 200 });
  } catch (error: any) {
    console.error("Error when getting categories", error);
    return NextResponse.json({}, { status: 500 });
  }
};

/**
 * @async
 * @function POST
 * @description Creates a new category.
 * @param {NextRequest} req - The request object containing the category name and token.
 * @returns {Promise<NextResponse>} The server response.
 */
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

/**
 * @async
 * @function validatePostRequest
 * @description Validates the POST request for creating a new category.
 * @param {string} name - The name of the new category.
 * @param {string} token - The authentication token.
 * @returns {Promise<NextResponse | null>} A response object if validation fails, otherwise null.
 */
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

/**
 * @function rearrangeCategories
 * @description Rearranges categories based on predefined order.
 * @param {CategoryDocument[]} categories - The original array of categories.
 * @returns {CategoryDocument[]} The rearranged array of categories.
 */
const rearrangeCategories = (
  categories: CategoryDocument[],
): CategoryDocument[] => {
  const rearranged: CategoryDocument[] = [];

  categories.forEach((category: CategoryDocument) => {
    switch (category.name) {
      case "tops":
        rearranged[0] = category;
        break;
      case "bottoms":
        rearranged[1] = category;
        break;
      default:
        break;
    }
  });

  return rearranged;
};
