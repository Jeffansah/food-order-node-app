import { Request } from "express";
import jwt from "jsonwebtoken";
import { AuthPayload } from "../types/auth.types";

export const validateToken = async (req: Request) => {
  const token = req.cookies?.token;

  if (!token) {
    return false;
  }

  try {
    const payload = (await jwt.verify(
      token,
      process.env.JWT_SECRET!
    )) as AuthPayload;

    req.user = payload;

    return true;
  } catch (error) {
    console.error("Token verification failed", error);
    return false;
  }
};
