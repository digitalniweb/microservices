import express from "express";
const router = express.Router();
import * as controller from "../../../../controller/api/users/auth/admin/users.js";

router.get("/", controller.allUsers);
router.get("/user/:id", controller.findUser);
router.get("/tenant/:id", controller.findTenant);

router.post("/admin/register", controller.registerAdmin);

export default router;
