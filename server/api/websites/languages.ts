import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/websites/languages.js";

router.get("/list", controller.getLanguagesList);
router.get("/websitemutations", controller.getWebsiteLanguageMutations);

export default router;
