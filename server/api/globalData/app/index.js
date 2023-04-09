import express from "express";
const router = express.Router();
import checkAuth from "../../../middleware/checkAuth.js"; // !!! this does nothing now
import * as controller from "../../../controller/api/globalData/apps.js";

router.get("/", checkAuth, controller.getApp);
router.use("/register", checkAuth, controller.register);

export default router;
