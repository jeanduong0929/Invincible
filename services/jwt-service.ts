import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  _id: string;
  email: string;
}

export const isValidToken = (token: string): boolean => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return !!decoded;
  } catch (error) {
    console.error("Error when verifying token", error);
    return false;
  }
};

export const getDecodedToken = (token: string): string | JwtPayload | null => {
  try {
    const decoded: string | JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    );
    return decoded;
  } catch (error: any) {
    console.error("Error when decoding token", error);
    return null;
  }
};
