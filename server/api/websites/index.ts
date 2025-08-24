import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/websites/websites.js";
import currentRoutes from "./current/index.js";

router.use("/current", currentRoutes);

router.get("/websitemutations", controller.getWebsiteLanguageMutations);

router.get("/getuuid/:id", controller.getWebsitesUuid);

router.get("/url/:url", controller.getWebsiteByUrl);
router.get("/testingwebsitescount", controller.testingWebsitesCount);
router.get("/tenantwebsites/:userId", controller.findTenantWebsites);

router.post("/register/tenant", controller.registerTenant);
router.post("/create", controller.createwebsite);

router.post("/addwebsitemodules", controller.addWebsiteModules);

router.get("/test", controller.test);

export default router;
