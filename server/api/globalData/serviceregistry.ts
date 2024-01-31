import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/globalData/serviceregistry.js";
import { checkRegisterServiceAuth } from "../../middleware/checkAuth.js";
import apiRoutesApp from "./app/index.js";

router.use("/app", apiRoutesApp);
router.get("/name/:name", controller.getServiceByName);
router.get("/id/:id", controller.getServiceById);
router.get(
	"/mainservicebyname/:name",
	checkRegisterServiceAuth,
	controller.getMainServiceByName
);

router.post("/register", checkRegisterServiceAuth, controller.register);

// authorized only
/* router.post("/", checkAuthorization(), controller.testPost);
router.post("/", checkAuthorization(), controller.addRedirect);
router.delete("/", checkAuthorization(), controller.deleteRedirect); */

export default router;
