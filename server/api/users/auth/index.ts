import express from "express";
const router = express.Router();
import { checkAuthorization } from "../../../middleware/checkAuth.js";
import adminRoutes from "./admin/index.js";
import userRoutes from "./user/index.js";

// import usersRoutes from './users.js'; // all auth if needed
// router.use("/users", usersRoutes);

router.use("/admin", adminRoutes);
router.use("/user", userRoutes);

export default router;
