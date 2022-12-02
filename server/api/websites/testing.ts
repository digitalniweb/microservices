import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/websites/testing.js";

router.get("/", controller.test);

export default router;
