import mongoose, { Schema, Document, Model } from "mongoose";

interface IVendor extends Document {
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  foodType: [string];
  pincode: string;
  password: string;
  salt: string;
  serviceAvailable: Boolean;
  coverImages: [string];
  rating: number;
  //   foods: any;
}

const VendorSchema = new Schema<IVendor>(
  {
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    foodType: { type: [String], required: true },
    pincode: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvailable: { type: Boolean },
    coverImages: { type: [String] },
    rating: { type: Number },
    // foods: { type: Schema.Types.ObjectId, ref: "Food" },
  },
  { timestamps: true }
);

export const Vendor = mongoose.model<IVendor>("Vendor", VendorSchema);
