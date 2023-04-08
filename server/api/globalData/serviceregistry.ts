import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/globalData/apps.js";
// const checkAuth = require("../middleware/check-auth");

router.get("/", controller.getApp);
router.post("/register", controller.register);

// authorized only
/* router.post("/", checkAuth(), controller.testPost);
router.post("/", checkAuth(), controller.addRedirect);
router.delete("/", checkAuth(), controller.deleteRedirect); */

export default router;
