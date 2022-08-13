import express from "express";
const router = express.Router();
import checkAuth from "../middleware/checkAuth"; // !!! this does nothing now
import testingRoutes from "./testing";
import usersRoutes from "./users";

/* router.use("/websites", checkAuth, require("./websites"));
router.use("/languages", checkAuth, require("./languages")); */

router.use("/users", checkAuth, usersRoutes);
router.use("/testing", checkAuth, testingRoutes);

export = router;
