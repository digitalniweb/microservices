import express from "express";
const router = express.Router();
import * as controller from "../controller/api/rolesprivileges";

router.get("/list", controller.allList);

export = router;
