import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/globalData/serviceregistry.js";
import { checkRegisterServiceAuth } from "../../middleware/checkAuth.js";
import apiRoutesApp from "./app/index.js";

router.use("/app", apiRoutesApp);
router.get("/:name", controller.getServiceByName);
router.get("/getbyid/:id", controller.getServiceById);

router.post("/register", checkRegisterServiceAuth, controller.register);
router.get(
	"/getmainbyname/:name",
	checkRegisterServiceAuth,
	controller.getMainServiceByName
);

// authorized only
/* router.post("/", checkAuthorization(), controller.testPost);
router.post("/", checkAuthorization(), controller.addRedirect);
router.delete("/", checkAuthorization(), controller.deleteRedirect); */

export default router;
