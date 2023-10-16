import express from "express";
const router = express.Router();
import * as controller from "../../../controller/api/content/current/webinformation.js";

router.get("/webinformation", controller.webinformation);

export default router;
