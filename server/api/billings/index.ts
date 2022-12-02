import express from "express";
const router = express.Router();
import checkAuth from "../../middleware/checkAuth.js"; // !!! this does nothing now
import billingsRoutes from "./billings.js";

/* router.use("/websites", checkAuth, require("./websites"));
router.use("/languages", checkAuth, require("./languages")); */

router.use("/billings", checkAuth, billingsRoutes);

export default router;
