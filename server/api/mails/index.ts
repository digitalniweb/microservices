import express from "express";
const router = express.Router();
import checkAuth from "../../middleware/checkAuth.js"; // !!! this does nothing now
import testingRoutes from "./testing.js";
//import usersRoutes from "./users.js";

/* router.use("/websites", checkAuth, require("./websites"));
router.use("/languages", checkAuth, require("./languages")); */

//router.use("/users", checkAuth, usersRoutes);
router.use("/testing", checkAuth, testingRoutes);

export default router;
