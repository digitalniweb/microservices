import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/globalData/modules.js";

router.get("/list", controller.getModulesList);
router.get("/listbyids", controller.getModulesByIds);
router.get("/listbynames", controller.getModulesByNames);
router.get("/listofidsbynames", controller.getModulesIdsByNames);
router.get("/array", controller.getArray);

export default router;
