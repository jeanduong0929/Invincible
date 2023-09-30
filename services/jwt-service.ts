import jwt from "jsonwebtoken";

export const isValidToken = async (token: string): Promise<boolean> => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return !!decoded;
  } catch (error) {
    console.error("Error when verifying token", error);
    return false;
  }
};
