import connectDB from "@/lib/db";
import ProductEntity from "@/entities/product-entity";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import CartEntity, { CartDocument } from "@/entities/cart-entity";
import CartItemEntity, { CartItemDocument } from "@/entities/cart-item-entity";
import { getDecodedToken, isValidToken } from "@/services/jwt-service";

interface DecodedToken extends JwtPayload {
  _id: string;
  email: string;
}

/**
 * @async
 * @function GET
 * @description Retrieves the user's cart items.
 * @param {NextRequest} req - The request object containing the token.
 * @returns {Promise<NextResponse>} The server response containing the cart items.
 */
export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const token = req.headers.get("token") as string;

    const validation = validateGetRequest(token);
    if (validation) {
      return validation;
    }

    // Connect to the database
    await connectDB();

    // Decode the user from the token
    const decodedToken: DecodedToken = getDecodedToken(token) as DecodedToken;

    // Get the user cart
    const myCart: CartDocument | null = await CartEntity.findOne({
      user: decodedToken._id,
    });

    // Get the cart items
    const cartItems: CartItemDocument[] | null = await CartItemEntity.find({
      cart: myCart!._id,
    }).exec();

    return NextResponse.json(cartItems, { status: 200 });
  } catch (error: any) {
    console.error("Error when getting cart", error);
    return NextResponse.json({}, { status: 500 });
  }
};

/**
 * @async
 * @function POST
 * @description Adds a new item to the user's cart.
 * @param {NextRequest} req - The request object containing the product id and token.
 * @returns {Promise<NextResponse>} The server response.
 */
export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { productId } = await req.json();
    const token = req.headers.get("token") as string;

    // Validate the request
    const validation = validatePostRequest(productId, token);
    if (validation) {
      return validation;
    }

    // Connect to the database
    await connectDB();

    // Decode the user id from the token
    const { _id } = getDecodedToken(token) as DecodedToken;

    // Get the product
    const foundProduct = await ProductEntity.findById(productId);

    // Get the user cart
    const myCart = await getCart(_id);

    // Get the existing cart item
    const existingCartItem = await CartItemEntity.findOne({
      name: foundProduct.name,
      cart: myCart._id,
    });

    // If the cart item already exists, update the quantity else create a new cart item
    if (existingCartItem) {
      existingCartItem.quantity += 1;
      existingCartItem.price *= existingCartItem.quantity;
      await CartItemEntity.findByIdAndUpdate(existingCartItem._id, {
        quantity: existingCartItem.quantity,
        price: existingCartItem.price,
      });
    } else {
      await CartItemEntity.create({
        name: foundProduct.name,
        price: foundProduct.price,
        quantity: 1,
        description: foundProduct.description,
        image: foundProduct.image,
        cart: myCart._id,
      });
    }

    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    console.error("Error when adding to cart", error);
    return NextResponse.json({}, { status: 500 });
  }
};

/**
 * @async
 * @function PATCH
 * @description Updates a cart item's quantity.
 * @param {NextRequest} req - The request object containing the cart item id, add, minus and token.
 * @returns {Promise<NextResponse>} The server response.
 */
export const PATCH = async (req: NextRequest): Promise<NextResponse> => {
  try {
    // Get the request body
    const { id, add, minus } = await req.json();
    const token = req.headers.get("token") as string;

    // Validate the request
    const validation = validatePatchRequest(id, add, minus, token);
    if (validation) {
      return validation;
    }

    // Connect to the database
    await connectDB();

    // Get the cart item
    const foundCartItem = await CartItemEntity.findById(id);

    // Update the cart item
    if (add) {
      // If add is true, increment the quantity by 1
      await CartItemEntity.updateOne({
        quantity: foundCartItem!.quantity + 1,
      });
    } else if (minus) {
      // If minus is true, decrement the quantity by 1 only if the quantity is greater than 1
      await CartItemEntity.updateOne({
        quantity: foundCartItem.quantity > 1 ? foundCartItem.quantity - 1 : 1,
      });
    }

    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    console.error("Error when updating cart", error);
    return NextResponse.json({}, { status: 500 });
  }
};

/* ######################################## HELPER FUNCTIONS ######################################## */

/**
 * @function validateGetRequest
 * @description Validates the GET request for getting the user's cart items.
 * @param {string} token - The authentication token.
 * @returns {NextResponse | null} A response object if validation fails, otherwise null.
 */
const validateGetRequest = (token: string): NextResponse | null => {
  if (!token) {
    console.error("Missing token");
    return NextResponse.json({}, { status: 400 });
  }
  if (!isValidToken(token)) {
    console.error("Invalid token");
    return NextResponse.json({}, { status: 401 });
  }
  return null;
};

/**
 * @function validatePostRequest
 * @description Validates the POST request for adding a product to the user's cart.
 * @param {string} productId - The product id.
 * @param {string} token - The authentication token.
 * @returns {NextResponse | null} A response object if validation fails, otherwise null.
 */
const validatePostRequest = (
  productId: string,
  token: string
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

/**
 * @async
 * @function getCart
 * @description Returns the user's cart.
 * @param {string} _id - The user id.
 * @returns {Promise<CartDocument>} The user's cart.
 */
const getCart = async (_id: string): Promise<CartDocument> => {
  const existingCart = await CartEntity.findOne({ user: _id });
  if (!existingCart) {
    const newCart = await CartEntity.create({
      user: _id,
    });
    return newCart;
  }
  return existingCart;
};

/**
 * @function validatePatchRequest
 * @description Validates the PATCH request for updating a cart item's quantity.
 * @param {string} id - The cart item id.
 * @param {string} token - The authentication token.
 * @returns {NextResponse | null} A response object if validation fails, otherwise null.
 */
const validatePatchRequest = (
  id: string,
  token: string
): NextResponse | null => {
  if (!id || !token) {
    console.error("Missing id, add, minus or token");
    return NextResponse.json({}, { status: 400 });
  }
  if (!isValidToken(token)) {
    console.error("Invalid token");
    return NextResponse.json({}, { status: 401 });
  }
  return null;
};
