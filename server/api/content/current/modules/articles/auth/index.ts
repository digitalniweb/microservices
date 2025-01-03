import express from "express";
const router = express.Router();

import adminRoutes from "./admin/index.js";

router.use("/admin", adminRoutes);

export default router;
