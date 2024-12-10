import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "../types/auth.types";
import { validateToken } from "../utils/validateToken";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const validate = await validateToken(req);

  if (!validate) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};
