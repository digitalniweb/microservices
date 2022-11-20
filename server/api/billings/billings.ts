import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/billings/billings";

router.get("/", controller.test);

export = router;
