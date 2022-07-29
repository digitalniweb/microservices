import express from "express";
const router = express.Router();
import checkAuth from "../middleware/checkAuth"; // !!! this does nothing now
import testingRoutes from "./testing";

/* router.use("/websites", checkAuth, require("./websites"));
router.use("/languages", checkAuth, require("./languages")); */

router.use("/users", checkAuth, require("./users"));
router.use("/testing", checkAuth, testingRoutes);

export const apiRoutes = router;
