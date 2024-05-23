import express from "express";
const router = express.Router();
import * as controller from "../../../controller/api/content/current/menu.js";

router.get("/", controller.getMenu);

export default router;
