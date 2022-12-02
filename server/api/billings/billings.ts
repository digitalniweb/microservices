import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/billings/billings.js";

router.get("/", controller.test);

export default router;
