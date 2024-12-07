import { Request, Response, NextFunction } from "express";
import { Vendor } from "../models";
import { decryptPassword } from "../utils/decryptPassword";
import { LoginVendor } from "../types";

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | any> => {
  const { email, password } = <LoginVendor>req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const existingVendor = await Vendor.findOne({ email });

    if (!existingVendor) {
      return res.status(404).json({
        vendor: null,
        message: "Vendor not found",
      });
    }

    const result = await decryptPassword(password, existingVendor.password);

    if (!result) {
      return res.status(401).json({
        vendor: null,
        message: "Invalid password",
      });
    }

    return res
      .status(200)
      .json({ message: "Login successful!", vendor: existingVendor });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
