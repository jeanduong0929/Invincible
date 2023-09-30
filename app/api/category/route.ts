import CategoryEntity from "@/entities/category-entity";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { isValidToken } from "@/services/jwt-service";

export const GET = async (): Promise<NextResponse> => {
  try {
    await connectDB();
    const categories = await CategoryEntity.find();
    return NextResponse.json(categories, { status: 200 });
  } catch (error: any) {
    console.error("Error when getting categories", error);
    return NextResponse.json({}, { status: 500 });
  }
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { name, token } = await req.json();
    console.log("Name: ", name);
    console.log("Token: ", token);
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
    await connectDB();
    await CategoryEntity.create({
      name,
    });
    return NextResponse.json({}, { status: 201 });
  } catch (error: any) {
    console.error("Error when creating a category", error);
    return NextResponse.json({}, { status: 500 });
  }
};
