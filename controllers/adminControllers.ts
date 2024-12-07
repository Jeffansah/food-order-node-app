import { Response, Request, NextFunction } from "express";
import { CreateVendor as CreateVendorType } from "../types";
import { Vendor } from "../models";

export const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | any> => {
  const {
    name,
    ownerName,
    foodType,
    pincode,
    address,
    phone,
    email,
    password,
  } = <CreateVendorType>req.body;

  try {
    const existingVendor = await Vendor.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingVendor) {
      return res.status(400).json({
        message: "Vendor already exists",
        vendor: existingVendor,
      });
    }
    const vendor = await Vendor.create({
      name,
      ownerName,
      foodType,
      pincode,
      address,
      phone,
      email,
      password,
      salt: "some salt",
      serviceAvailable: false,
      coverImages: [],
      rating: 0,
    });
    return res.status(201).json({
      message: "Vendor created successfully",
      vendor,
    });
  } catch (error) {
    console.log(error);
    next(error);
    return;
  }
};

export const getVendors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const getVendorById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.params.id);
  res.send(`Vendor ID: ${req.params.id}`);
};
