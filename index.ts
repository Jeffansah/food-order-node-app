import express from "express";
import { AdminRouter, VendorRouter } from "./routes";
import { connectToDatabase } from "./mongo";

// App Initialization
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/admin", AdminRouter);
app.use("/vendor", VendorRouter);

// Server
connectToDatabase().then(() => {
  app.listen(9000, () => {
    console.clear();
    console.log("Server is running on port 9000");
  });
});
