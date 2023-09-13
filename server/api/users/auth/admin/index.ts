import express from "express";
const router = express.Router();
import { checkAuthorization } from "../../../../middleware/checkAuth.js";
import usersRoutes from "./users.js";

router.use("/users", checkAuthorization(), usersRoutes);

export default router;
