import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/users/rolesprivileges";

router.get("/list", controller.allList);

export = router;
