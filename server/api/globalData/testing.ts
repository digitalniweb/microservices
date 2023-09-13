import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/globalData/testing.js";
// const checkAuthorization = require("../middleware/checkAuth.js");

router.get("/", controller.test);

// authorized only
/* router.post("/", checkAuthorization(), controller.testPost);
router.post("/", checkAuthorization(), controller.addRedirect);
router.delete("/", checkAuthorization(), controller.deleteRedirect); */

export default router;
