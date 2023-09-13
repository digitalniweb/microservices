import express from "express";
const router = express.Router();
import { checkAuthorization } from "../../middleware/checkAuth.js";
import testingRoutes from "./testing.js";
//import usersRoutes from "./users.js";

/* router.use("/websites", checkAuthorization(), require("./websites"));
router.use("/languages", checkAuthorization(), require("./languages")); */

//router.use("/users", checkAuthorization(), usersRoutes);
router.use("/testing", checkAuthorization(), testingRoutes);

export default router;
