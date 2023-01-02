import express from "express";
const router = express.Router();
import checkAuth from "../../middleware/checkAuth.js"; // !!! this does nothing now
import testingRoutes from "./testing.js";

/* router.use("/websites", checkAuth, require("./websites"));
router.use("/languages", checkAuth, require("./languages")); */

router.use("/testing", checkAuth, testingRoutes);

export default router;
