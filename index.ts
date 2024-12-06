import express from "express";
import { AdminRouter, VendorRouter } from "./routes";

const app = express();

app.use("/admin", AdminRouter);
app.use("/vendor", VendorRouter);

app.listen(9000, () => {
  console.clear();
  console.log("Server is running on port 9000");
});
