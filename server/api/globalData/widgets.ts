import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/globalData/widgets.js";

router.get("/list", controller.getWidgetsList);
router.get("/listbyids", controller.getWidgetsByIds);
router.get("/array", controller.getArray);

router.get("/modulesids", controller.getModuleWidgetsIds);

export default router;
