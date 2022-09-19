import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/websites/websites";

router.get("/getwebsiteinfo", controller.getWebsiteInfo);
router.get("/testingwebsitescount", controller.testingWebsitesCount);
router.get("/gettenantwebsites", controller.getTenantWebsites);

router.post("/register/tenant", controller.registerTenant);

export = router;
