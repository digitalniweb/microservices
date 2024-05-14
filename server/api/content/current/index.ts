import express from "express";
const router = express.Router();
import * as controller from "../../../controller/api/content/current/webinformation.js";
import modulesRoutes from "./modules/index.js";

router.get("/webinformation", controller.webinformation);
router.patch("/webinformation", controller.webinformationPatch);

router.use("/modules", modulesRoutes);

export default router;
