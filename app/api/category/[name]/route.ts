import CategoryEntity, { CategoryDocument } from "@/entities/category-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles the creation of a new product by processing the POST request, validating the input,
 * and interacting with the database.
 *
 * @param req - The incoming request object, expected to contain the product data in JSON format.
 *
 * @returns A promise that resolves with a `NextResponse` object. The response will contain a status code
 * indicating the result of the operation: 201 for successful creation, 500 for server errors.
 *
 * @throws Will log any errors that occur during the process to the console.
 */
export const GET = async (
  _: NextRequest,
  context: { params: { name: string } },
): Promise<NextResponse> => {
  try {
    // Get the path params
    const { name } = context.params;

    // Connect to the database
    await connectDB();

    // Fetch the category
    const category: CategoryDocument | null = await CategoryEntity.findOne({
      name,
    });
    return NextResponse.json(category, { status: 200 });
  } catch (error: any) {
    console.error("Error when fetching product by name", error);
    return NextResponse.json({}, { status: 500 });
  }
};
