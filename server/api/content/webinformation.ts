import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/content/webinformation.js";

router.get("/:id", controller.getWebinformation);
router.post("/create", controller.createWebinformation);

export default router;
