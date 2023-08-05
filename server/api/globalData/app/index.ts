import express from "express";
const router = express.Router();
import {
	checkAuth,
	checkRegisterServiceAuth,
} from "../../../middleware/checkAuth.js";
import * as controller from "../../../controller/api/globalData/apps.js";

router.get("/", checkAuth(), controller.getApp);
router.post("/register", checkRegisterServiceAuth, controller.register);

export default router;
