export interface CreateVendor {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
}

export interface LoginVendor {
  email: string;
  password: string;
}

export interface VendorPayload {
  _id: string;
  email: string;
  name: string;
  foodType: [string];
}

export interface EditVendorProfile {
  name: string;
  address: string;
  phone: string;
  foodType: [string];
}
