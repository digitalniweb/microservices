import express from "express";
const router = express.Router();
import checkAuth from "../../middleware/checkAuth.js"; // !!! this does nothing now
import testingRoutes from "./testing.js";
import websitesRoutes from "./websites.js";
import languagesRoutes from "./languages.js";

router.use("/websites", checkAuth, websitesRoutes);
router.use("/languages", checkAuth, languagesRoutes);

router.use("/testing", checkAuth, testingRoutes);

export default router;
