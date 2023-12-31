import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/globalData/roles.js";

router.get("/list", controller.getRolesList);
router.get("/listbyids", controller.getRolesByIds);

export default router;
