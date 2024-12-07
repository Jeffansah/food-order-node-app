import { Response, Request, NextFunction } from "express";
import { CreateVendor as CreateVendorType } from "../types";
import { Vendor } from "../models";
import { encryptPassword } from "../utils";
import mongoose from "mongoose";

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
      password: (await encryptPassword(password)).encryptedPassword,
      salt: (await encryptPassword(password)).salt,
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

export const getVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | any> => {
  try {
    const vendors = await Vendor.find();
    return res.status(200).json(vendors);
  } catch (error) {
    console.log(error);
    next(error);
    return;
  }
};

export const getVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ vendor: null, message: "Vendor not found" });
    }

    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return res
        .status(404)
        .json({ vendor: null, message: "Vendor not found" });
    }

    return res.status(200).json(vendor);
  } catch (error) {
    console.log(error);
    next(error);
    return;
  }
};
