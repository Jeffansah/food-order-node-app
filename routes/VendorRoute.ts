import { Router } from "express";
import {
  addVendorFood,
  editVendorProfile,
  editVendorService,
  getVendorFood,
  getVendorProfile,
  vendorLogin,
} from "../controllers";
import { Authenticate } from "../middleware";

const router = Router();

//AUTHENTICATION
//Login
router.post("/login", vendorLogin);

// Authenticate vendor
router.use(Authenticate);

// PROFILE
// View vendor Profile route
router.get("/profile", getVendorProfile);

// Edit vendor profile route
router.patch("/profile", editVendorProfile);

// Edit vendor service route
router.patch("/service", editVendorService);

// FOOD
// food vendor route
router.get("/food", getVendorFood);
router.post("/food", addVendorFood);

export { router as VendorRouter };
