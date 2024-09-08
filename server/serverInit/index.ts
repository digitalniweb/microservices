import { microservices } from "../../digitalniweb-types/index.js";
import { log } from "./../../digitalniweb-custom/helpers/logger.js";

import Subscriber from "./../../digitalniweb-custom/helpers/subscriberService.js";

import {
	registerCurrentMicroservice,
	registerCurrentApp,
	requestServiceRegistryInfo,
} from "../../digitalniweb-custom/helpers/serviceRegistryCache.js";

// import loadModels from "../loadModels.js";

export default async function () {
	let microservice = process.env.MICROSERVICE_NAME as microservices;

	// load all service's models
	// await loadModels();
	try {
		const msInit = await import("./" + microservice + ".js");
		log({
			message: `ServerInit for ${process.env.MICROSERVICE_NAME} loaded.`,
			type: "consoleLogProduction",
			status: "success",
		});
		try {
			await msInit.default();
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

		// register (if not registered already) microservice/app after globalData is registered
		Subscriber.on("message", async (channel, message) => {
			if (channel === "globalDataMessage") {
				if (message === "registered") {
					try {
						if (process.env.MICROSERVICE_NAME) {
							// microservice
							if (!process.env.MICROSERVICE_ID)
								await registerCurrentMicroservice();
						} else {
							// app
							if (!process.env.APP_ID) await registerCurrentApp();
						}
						log({
							message: `${
								process.env.MICROSERVICE_NAME
									? process.env.MICROSERVICE_NAME
									: process.env.APP_NAME
							} registered on 'globalData registered'.`,
							type: "consoleLogProduction",
							status: "success",
						});
					} catch (error) {
						log({
							type: "consoleLogProduction",
							status: "error",
							message: `Couldn't register ${
								process.env.MICROSERVICE_NAME
									? process.env.MICROSERVICE_NAME
									: process.env.APP_NAME
							} after 'globalData registered'.`,
						});
					}
				}
			}
		});
	}

	// all microservices
}
