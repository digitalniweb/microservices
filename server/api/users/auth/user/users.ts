import express from "express";
const router = express.Router();
import * as controller from "../../../../controller/api/users/auth/user/users.js";

router.get("/", controller.refreshtoken);

router.post("/admin/register", controller.editUserProfile);

export default router;
