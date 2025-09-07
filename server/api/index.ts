import express from "express";

const router = express.Router();

// services specific
// import apiRoutesWebsites from "./websites/index.js";
// import apiRoutesUsers from "./users/index.js";
// import apiRoutesBillings from "./billings/index.js";
// import apiRoutesGlobalData from "./globalData/index.js";
// import apiRoutesContent from "./content/index.js";
// import apiRoutesMails from "./mails/index.js";

// default

import * as healthCheckController from "../controller/api/healthCheck.js";

// services specific
let { default: apiRoutes } = await import(
	`./${process.env.MICROSERVICE_NAME}/index.js`
);
router.use("/", apiRoutes);
// if (process.env.MICROSERVICE_NAME == "websites") {
// 	let { default: apiRoutes } = await import("./websites/index.js");
// 	router.use("/", apiRoutes);
// } else if (process.env.MICROSERVICE_NAME === "users") {
// 	const { default: apiRoutes } = await import("./users/index.js");
// 	router.use("/", apiRoutes);
// } else if (process.env.MICROSERVICE_NAME === "billings") {
// 	const { default: apiRoutes } = await import("./billings/index.js");
// 	router.use("/", apiRoutes);
// } else if (process.env.MICROSERVICE_NAME === "globalData") {
// 	const { default: apiRoutes } = await import("./globalData/index.js");
// 	router.use("/", apiRoutes);
// } else if (process.env.MICROSERVICE_NAME === "content") {
// 	const { default: apiRoutes } = await import("./content/index.js");
// 	router.use("/", apiRoutes);
// }

// default for all services

router.get("/health-check", healthCheckController.check);

export default router;
