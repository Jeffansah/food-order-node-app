import express, { Response, Request, NextFunction, Router } from "express";
import { VendorLogin } from "../controllers";

const router = Router();

router.post("/login", VendorLogin);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Vendor Route");
});

export { router as VendorRouter };
