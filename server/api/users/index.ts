import express from "express";
const router = express.Router();
import testingRoutes from "./testing.js";
import usersRoutes from "./users.js";
import authRoutes from "./auth/index.js";

/* router.use("/websites", checkAuthorization(), require("./websites"));
router.use("/languages", checkAuthorization(), require("./languages")); */

router.use("/users", usersRoutes);
router.use("/testing", testingRoutes);

router.use("/auth", authRoutes);

export default router;
