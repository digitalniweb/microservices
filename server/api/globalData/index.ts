import express from "express";
const router = express.Router();
import { checkAuth } from "../../middleware/checkAuth.js"; // !!! this does nothing now
import testingRoutes from "./testing.js";
import serviceRegistryRoutes from "./serviceregistry.js";

/* router.use("/websites", checkAuth, require("./websites"));
router.use("/languages", checkAuth, require("./languages")); */

router.use("/testing", checkAuth, testingRoutes);
router.use("/serviceregistry", checkAuth, serviceRegistryRoutes);

export default router;
