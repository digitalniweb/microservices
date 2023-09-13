import express from "express";
const router = express.Router();
import { checkAuthorization } from "../../middleware/checkAuth.js";
import billingsRoutes from "./billings.js";

/* router.use("/websites", checkAuthorization(), require("./websites"));
router.use("/languages", checkAuthorization(), require("./languages")); */

router.use("/billings", checkAuthorization(), billingsRoutes);

export default router;
