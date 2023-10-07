import RoleEntity from "@/entities/role-entity";
import UserEntity from "@/entities/user-entity";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    // Get the req body
    const { email, password } = await req.json();

    console.log("Email: ", email);
    console.log("Password: ", password);

    // Validate the request
    const validation = await validatePostRequest(email, password);
    if (validation) {
      return validation;
    }

    // Find default role
    let defaultRole = await RoleEntity.findOne({ name: "DEFAULT" });

    // If default role doesn't exist, create it
    if (!defaultRole) {
      defaultRole = await RoleEntity.create({ name: "DEFAULT" });
    }

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the user
    await UserEntity.create({
      email,
      password: hashedPassword,
      role: defaultRole._id,
    });

    return NextResponse.json({}, { status: 201 });
  } catch (error: any) {
    console.error("Error when creating a user", error);
    return NextResponse.json({}, { status: 500 });
  }
};

/* ######################################## HELPER FUNCTIONS ######################################## */

const validatePostRequest = async (
  email: string,
  password: string,
): Promise<NextResponse | null> => {
  if (
    !email ||
    !password ||
    !isValidEmail(email) ||
    !isValidPassword(password)
  ) {
    return NextResponse.json({}, { status: 400 });
  }

  if (await UserEntity.findOne({ email })) {
    return NextResponse.json({}, { status: 409 });
  }

  return null;
};

const isValidEmail = (email: string): boolean => {
  return /(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/.test(email);
};

const isValidPassword = (password: string): boolean => {
  return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}/.test(password);
};
