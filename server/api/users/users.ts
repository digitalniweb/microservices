import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/users/users.js";

router.get("/id/:id", controller.getById);
router.get("/getwebsiteuserbyemail", controller.getWebsiteUserByEmail);

router.post("/authenticate", controller.authenticate);
router.post("/register", controller.register);
router.post("/registeradmin", controller.registerAdmin);

export default router;
