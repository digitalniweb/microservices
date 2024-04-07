import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/globalData/modules.js";

router.get("/list", controller.getModulesList);
router.get("/listbyids", controller.getModulesByIds);

export default router;
