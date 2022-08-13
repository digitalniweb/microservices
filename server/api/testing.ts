import express from "express";
const router = express.Router();
import * as controller from "../controller/api/testing";
// const checkAuth = require("../middleware/check-auth");

router.get("/", controller.test);
router.post("/", controller.testPost);

// authorized only
/* router.post("/", checkAuth(), controller.testPost);
router.post("/", checkAuth(), controller.addRedirect);
router.delete("/", checkAuth(), controller.deleteRedirect); */

export = router;
