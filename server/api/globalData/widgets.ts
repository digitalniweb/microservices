import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/globalData/widgets.js";

router.get("/list", controller.getWidgetsList);
router.get("/listbyids", controller.getWidgetsByIds);

export default router;
