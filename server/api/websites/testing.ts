import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/websites/testing.js";
import * as controller2 from "../../controller/api/websites/testing2.js";

router.get("/", controller.test);
router.get("/2", controller2.test);

export default router;
