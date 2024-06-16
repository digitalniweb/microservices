import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/globalData/adminmenu.js";

router.get("/list", controller.getAdminMenuList);
router.get("/listbyids", controller.getAdminMenuByIds);

export default router;
