import express from "express";

const router = express.Router();

// services specific

import apiRoutesWebsites from "./websites/index.js";
import apiRoutesUsers from "./users/index.js";
import apiRoutesBillings from "./billings/index.js";

// default

import * as healthCheckController from "../controller/api/healthCheck.js";

// services specific

if (process.env.MICROSERVICE_NAME == "websites")
	router.use("/", apiRoutesWebsites);
else if (process.env.MICROSERVICE_NAME == "users")
	router.use("/", apiRoutesUsers);
else if (process.env.MICROSERVICE_NAME == "billings")
	router.use("/", apiRoutesBillings);

// default for all services

router.get("/health-check", healthCheckController.check);

export default router;
