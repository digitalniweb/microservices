import { microservices } from "../../digitalniweb-types/index.js";
import { log } from "./../../digitalniweb-custom/helpers/logger.js";

import Subscriber from "./../../digitalniweb-custom/helpers/subscriberService.js";

import {
	registerCurrentMicroservice,
	registerCurrentApp,
	requestServiceRegistryInfo,
} from "../../digitalniweb-custom/helpers/serviceRegistryCache.js";

export default async function () {
	let microservice = process.env.MICROSERVICE_NAME as microservices;
	try {
		const msInit = await import("./" + microservice + ".js");
		log({
			message: `ServerInit for ${process.env.MICROSERVICE_NAME} loaded.`,
			type: "consoleLogProduction",
			status: "success",
		});
		try {
			msInit.default();
			log({
				message: `ServerInit for ${process.env.MICROSERVICE_NAME} executed.`,
				type: "consoleLogProduction",
				status: "success",
			});
		} catch (error: any) {
			log({
				error,
				type: "consoleLogProduction",
				status: "error",
				message: `ServerInit for ${process.env.MICROSERVICE_NAME} didn't execute.`,
			});
		}
	} catch (error: any) {
		if (error.code == "ERR_MODULE_NOT_FOUND")
			log({
				type: "consoleLogProduction",
				status: "error",
				message: `ServerInit for ${process.env.MICROSERVICE_NAME} wasn't found.`,
			});
		else
			log({
				error,
				type: "consoleLogProduction",
				status: "error",
				message: `ServerInit for ${process.env.MICROSERVICE_NAME} didn't load.`,
			});
	}

	// all microservices but globalData
	if (process.env.MICROSERVICE_NAME !== "globalData") {
		await Subscriber.psubscribe("serviceRegistry-responseInformation-*"); // handled in registerCurrentMicroservice()
		let serviceRegistryInfo = await requestServiceRegistryInfo();
		if (!serviceRegistryInfo) {
			log({
				type: "consoleLogProduction",
				status: "error",
				message: "Couldn't get serviceRegistry information.",
			});
			throw "Couldn't get serviceRegistry information.";
		}
		if (process.env.MICROSERVICE_NAME) {
			// microservice
			await registerCurrentMicroservice();
		} else {
			// app
			await registerCurrentApp();
		}
	}

	// all microservices
}
