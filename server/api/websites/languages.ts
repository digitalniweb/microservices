import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/websites/languages";

router.get("/list", controller.getLanguagesList);
router.get("/websitemutations", controller.getWebsiteLanguageMutations);

module.exports = router;
