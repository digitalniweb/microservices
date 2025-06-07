import express from "express";
const router = express.Router();
import webinformationRoutes from "./webinformation.js";
import currentRoutes from "./current/index.js";

router.use("/current", currentRoutes);
router.use("/webinformation", webinformationRoutes);

export default router;
