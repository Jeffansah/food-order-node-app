import { Router } from "express";
import {
  addVendorFood,
  editVendorProfile,
  editVendorService,
  getVendorFood,
  getVendorProfile,
  updateVendorCoverImage,
  vendorLogin,
} from "../controllers";
import { Authenticate } from "../middleware";
import { images } from "../utils/multerConfig";

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

// Update vendor profile image
router.post("/profile/coverimage", images, updateVendorCoverImage);

// Edit vendor service route
router.patch("/service", editVendorService);

// FOOD
// food vendor route
router.get("/food", getVendorFood);
router.post("/food", images, addVendorFood);

export { router as VendorRouter };
