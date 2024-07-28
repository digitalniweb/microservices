import express from "express";
const router = express.Router();

import adminRoutes from "./admin/index.js";
import userRoutes from "./user/index.js";

router.use("/admin", adminRoutes);
router.use("/user", userRoutes);

export default router;
