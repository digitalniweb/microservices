import express from "express";
const router = express.Router();
import currentRoutes from "./current/index.js";

router.use("/current", currentRoutes);

export default router;
