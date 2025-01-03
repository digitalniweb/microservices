import express from "express";
const router = express.Router();
import * as controller from "../../../../../controller/api/content/current/modules/articles.js";
import authRoutes from "./auth/index.js";

router.get("/", controller.getArticle);

router.use("/auth", authRoutes);

export default router;
