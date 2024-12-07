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
