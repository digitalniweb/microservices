import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/users/users.js";

import { loginAntispam } from "../../middleware/antispam.js";

router.get("/id/:id", controller.getById);

router.post("/authenticate", loginAntispam(), controller.authenticate);
router.post("/", controller.register);

export default router;
