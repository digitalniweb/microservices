import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/websites/testing";

router.get("/", controller.test);

export = router;
