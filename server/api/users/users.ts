import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/users/users.js";

router.get("/id/:id", controller.getById);

router.post("/authenticate", controller.authenticate);
router.post("/", controller.register);

export default router;
