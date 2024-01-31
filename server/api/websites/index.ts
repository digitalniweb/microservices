import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/websites/websites.js";

router.get("/websitemutations", controller.getWebsiteLanguageMutations);

router.get("/url/:url", controller.getWebsiteByUrl);
router.get("/testingwebsitescount", controller.testingWebsitesCount);
router.get("/tenantwebsites", controller.findTenantWebsites);

router.post("/register/tenant", controller.registerTenant);
router.post("/create", controller.createwebsite);

router.get("/test", controller.test);

export default router;
