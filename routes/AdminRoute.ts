import { Router } from "express";
import { CreateVendor, getVendorById, getVendors } from "../controllers";

const router = Router();

router.post("/vendor", CreateVendor);

router.get("/vendor", getVendors);

router.get("/vendor/:id", getVendorById);

export { router as AdminRouter };
