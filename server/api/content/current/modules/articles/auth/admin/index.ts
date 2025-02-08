import express from "express";
const router = express.Router();
import * as controller from "../../../../../../../controller/api/content/current/modules/articles.js";

router.patch("/edit", controller.editArticle);
router.put("/create", controller.createArticle);
router.delete("/delete", controller.deleteArticle);

export default router;
