import express from "express";
const router = express.Router();
import webinformationRoutes from "./webinformation.js";
import currentRoutes from "./current/index.js";
import testingRoutes from "./testing.js";

router.use("/current", currentRoutes);
router.use("/webinformation", webinformationRoutes);
router.use("/testing", testingRoutes);

export default router;
