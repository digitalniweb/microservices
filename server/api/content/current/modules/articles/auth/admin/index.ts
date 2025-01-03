import express from "express";
const router = express.Router();
import * as controller from "../../../../../../../controller/api/content/current/modules/articles.js";

router.post("/edit", controller.editArticle);

export default router;
