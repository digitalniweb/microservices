import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/users/authorization.js";

router.get("/list", controller.allList);

export default router;
