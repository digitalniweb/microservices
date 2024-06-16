import express from "express";
const router = express.Router();
// import { checkAuthorization } from "../../middleware/checkAuth.js";
import testingRoutes from "./testing.js";
import languageRoutes from "./languages.js";
import rolesRoutes from "./roles.js";
import serviceRegistryRoutes from "./serviceregistry.js";
import modulesRoutes from "./modules.js";
import adminMenuRoutes from "./adminmenu.js";
import widgetsRoutes from "./widgets.js";

/* router.use("/websites", checkAuthorization(), require("./websites"));
router.use("/languages", checkAuthorization(), require("./languages")); */

router.use("/testing", testingRoutes);
router.use("/languages", languageRoutes);
router.use("/roles", rolesRoutes);
router.use("/serviceregistry", serviceRegistryRoutes);
router.use("/modules", modulesRoutes);
router.use("/adminmenu", adminMenuRoutes);
router.use("/widgets", widgetsRoutes);

export default router;
