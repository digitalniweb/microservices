import express from "express";
const router = express.Router();
import { checkAuth } from "../../../../middleware/checkAuth.js";
import usersRoutes from "./users.js";

router.use("/users", checkAuth, usersRoutes);

export default router;
