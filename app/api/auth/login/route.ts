import bcrypt from "bcrypt";
import connectDB from "@/lib/db";
import jwt from "jsonwebtoken";
import UserEntity, { UserDocument } from "@/entities/user-entity";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    // Get the body of the request
    const { email, password } = await req.json();

    // Connect to the database
    await connectDB();

    // Find the user
    const existingUser = await UserEntity.findOne({ email });

    // Validate the request
    const validation = await validatePostRequest(email, password, existingUser);
    if (validation) return validation;

    // Create jwt token
    const token = jwt.sign(
      {
        _id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );

    // Return the response
    return NextResponse.json(
      {
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
        token,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({}, { status: 500 });
  }
};

/* ######################################## HELPER FUNCTIONS ######################################## */

const validatePostRequest = async (
  email: string,
  password: string,
  existingUser: UserDocument | null,
): Promise<NextResponse | null> => {
  if (!email || !password) {
    return NextResponse.json({}, { status: 400 });
  }

  if (
    !existingUser ||
    !(await bcrypt.compare(password, existingUser.password))
  ) {
    return NextResponse.json({}, { status: 401 });
  }

  return null;
};
