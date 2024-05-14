import express from "express";
const router = express.Router();
import articlesRoutes from "./articles/index.js";

router.use("/article", articlesRoutes);
export default router;
