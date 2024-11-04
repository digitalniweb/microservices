import express from "express";
const router = express.Router();
import * as controller from "../../../controller/api/content/current/menu.js";

router.get("/", controller.getMenu);
router.get("/all", controller.getMenuAll);

export default router;
