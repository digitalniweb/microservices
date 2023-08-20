import express from "express";
const router = express.Router();
import { checkAuth } from "../../middleware/checkAuth.js";
import testingRoutes from "./testing.js";
import serviceRegistryRoutes from "./serviceregistry.js";

/* router.use("/websites", checkAuth(), require("./websites"));
router.use("/languages", checkAuth(), require("./languages")); */

router.use("/testing", testingRoutes);
router.use("/serviceregistry", serviceRegistryRoutes);

export default router;
