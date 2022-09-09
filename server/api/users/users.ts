import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/users/users";

import { loginAntispam } from "../../middleware/antispam";

router.get("/", controller.allUsers);
router.get("/user/:id", controller.getUser);
router.get("/tenant/:id", controller.getTenant);
router.post("/authenticate", loginAntispam(), controller.authenticate);
router.post("/refreshtoken", controller.refreshtoken);
router.post("/", controller.register);
router.post("/admin/", controller.registerAdmin);

export = router;
