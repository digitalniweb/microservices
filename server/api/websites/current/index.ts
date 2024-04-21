import express from "express";
const router = express.Router();
import * as controller from "../../../controller/api/websites/current/modules.js";

router.get("/modulesIds", controller.getModulesIds);
router.get("/languagesIds", controller.getLanguagesIds);

export default router;
