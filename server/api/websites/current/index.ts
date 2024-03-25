import express from "express";
const router = express.Router();
import * as controller from "../../../controller/api/websites/current/modules.js";

router.get("/modulesIds", controller.getModulesIds);

export default router;
