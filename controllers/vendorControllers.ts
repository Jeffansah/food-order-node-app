import { Request, Response, NextFunction } from "express";
import { Vendor } from "../models";
import { decryptPassword } from "../utils/decryptPassword";
import { EditVendorProfile, LoginVendor } from "../types";
import { generateToken } from "../utils/generateToken";
import { Food } from "../models/foodModel";

export const vendorLogin = async (
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

    const token = generateToken({
      _id: existingVendor._id as string,
      email: existingVendor.email,
      name: existingVendor.name,
      foodType: existingVendor.foodType,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400000,
    });

    return res.status(200).json({
      message: "Login successful!",
      vendor: existingVendor,
      token,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | any> => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const existingVendor = await Vendor.findById(user._id);

    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    return res.status(200).json({ vendor: existingVendor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching vendor", error });
  }
};
export const editVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | any> => {
  const updatedFields = <EditVendorProfile>req.body;

  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const updatedVendor = await Vendor.findOneAndUpdate(
      { _id: user._id },
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    if (!updatedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({
      message: "Vendor updated successfully",
      vendor: updatedVendor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating vendor", error });
  }
};

export const updateVendorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | any> => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const vendor = await Vendor.findById(user._id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const files = req.files as Express.Multer.File[];

    const coverImages = files.map((file: Express.Multer.File) => file.filename);

    vendor.coverImages.push(...coverImages);

    const updatedVendor = await vendor.save();

    res.status(200).json({
      message: "Vendor cover images updated successfully",
      vendor: updatedVendor,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating vendor cover image", error });
  }
};

export const editVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | any> => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const existingVendor = await Vendor.findById(user._id);

    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    existingVendor.serviceAvailable = !existingVendor.serviceAvailable;

    const updatedVendor = await existingVendor.save();

    res.status(200).json({
      message: "Vendor service updated successfully",
      vendor: updatedVendor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating vendor service", error });
  }
};

export const getVendorFood = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | any> => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const vendor = await Vendor.findById(user._id).populate("foods");

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json(vendor.foods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching vendor foods", error });
  }
};
export const addVendorFood = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | any> => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { name, description, category, foodType, readyTime, price } =
      req.body;

    const vendor = await Vendor.findById(user._id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    //check if food exists under vendor by its name and price
    const existingFood = await Food.findOne({
      vendorId: vendor._id,
      name,
      price,
    });

    if (existingFood) {
      return res.status(400).json({
        message: "Food item already exists under this vendor",
      });
    }

    const files = req.files as Express.Multer.File[];

    console.log(files);

    const images = files.map((file: Express.Multer.File) => file.filename);

    const food = await Food.create({
      vendorId: vendor._id,
      name,
      description,
      category,
      foodType,
      readyTime,
      price,
      rating: 0,
      images,
    });

    vendor.foods.push(food);
    const updatedVendor = await vendor.save();

    res.status(201).json({
      message: "Food added successfully",
      food,
      vendor: updatedVendor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding food", error });
  }
};
