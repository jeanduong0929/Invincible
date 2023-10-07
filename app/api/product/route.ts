import CategoryEntity from "@/entities/category-entity";
import ProductEntity, { ProductDocument } from "@/entities/product-entity";
import connectDB from "@/lib/db";
import { isValidToken } from "@/services/jwt-service";
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
export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    // Get the req body and token from headers
    const { name, price, description, image, category } = await req.json();
    const token = req.headers.get("token") as string;

    // Connect to the database
    await connectDB();

    // Validate the request
    const validation = await validatePostRequest(
      name,
      price,
      description,
      image,
      category,
      token,
    );
    if (validation) return validation;

    // Create the product
    await ProductEntity.create<ProductDocument>({
      name,
      price,
      description,
      image,
      category: category,
    });

    // Return the response
    return NextResponse.json({}, { status: 201 });
  } catch (error: any) {
    // Return an error response
    console.error("Error when creating a product", error);
    return NextResponse.json({}, { status: 500 });
  }
};

/* ######################################## HELPER FUNCTIONS ######################################## */

/**
 * Validates the data provided in a POST request for creating a new product.
 *
 * @param name - The name of the product.
 * @param price - The price of the product.
 * @param description - A description of the product.
 * @param image - A URL to an image of the product.
 * @param categoryId - The ID of the category to which the product belongs.
 * @param token - The authentication token.
 *
 * @returns A promise that resolves with a `NextResponse` object if validation fails,
 * or `null` if validation passes. The `NextResponse` will contain a status code and
 * possibly an error message indicating the validation failure.
 *
 * @throws Will log any validation errors that occur during the process to the console.
 */
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
