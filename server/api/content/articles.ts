import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/content/articles.js";

router.put("/create", controller.createWebsiteFirstArticle);

export default router;
