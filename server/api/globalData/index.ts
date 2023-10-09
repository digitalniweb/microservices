import express from "express";
const router = express.Router();
// import { checkAuthorization } from "../../middleware/checkAuth.js";
import testingRoutes from "./testing.js";
import languageRoutes from "./languages.js";
import serviceRegistryRoutes from "./serviceregistry.js";

/* router.use("/websites", checkAuthorization(), require("./websites"));
router.use("/languages", checkAuthorization(), require("./languages")); */

router.use("/testing", testingRoutes);
router.use("/languages", languageRoutes);
router.use("/serviceregistry", serviceRegistryRoutes);

export default router;
