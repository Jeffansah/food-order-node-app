import jwt from "jsonwebtoken";
import { VendorPayload } from "../types";

export const generateToken = (payload: VendorPayload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  return token;
};
