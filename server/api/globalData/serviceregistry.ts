import express from "express";
const router = express.Router();
import * as controller from "../../controller/api/globalData/serviceregistry.js";
// const checkAuth = require("../middleware/check-auth");
import apiRoutesApp from "./app/index.js";

router.use("/app", apiRoutesApp);
router.get("/:name", controller.getServiceByName);
router.get("/getbyid/:id", controller.getServiceById);

router.post("/register", controller.register);

// authorized only
/* router.post("/", checkAuth(), controller.testPost);
router.post("/", checkAuth(), controller.addRedirect);
router.delete("/", checkAuth(), controller.deleteRedirect); */

export default router;
