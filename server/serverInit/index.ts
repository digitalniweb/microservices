import type { microservices } from "../../digitalniweb-types/index.js";

import Subscriber from "./../../digitalniweb-custom/helpers/subscriberService.js";

import {
	registerCurrentMicroservice,
	registerCurrentApp,
	requestServiceRegistryInfo,
} from "../../digitalniweb-custom/helpers/serviceRegistryCache.js";
import { consoleLogProduction } from "../../digitalniweb-custom/helpers/logger.js";

// import loadModels from "../loadModels.js";

export default async function () {
	let microservice = process.env.MICROSERVICE_NAME as microservices;

	// load all service's models
	// await loadModels();
	try {
		const msInit = await import("./" + microservice + ".js");
		consoleLogProduction(
			`ServerInit for ${process.env.MICROSERVICE_NAME} loaded.`,
			"success"
		);
		try {
			await msInit.default();
			consoleLogProduction(
				`ServerInit for ${process.env.MICROSERVICE_NAME} executed.`,
				"success"
			);
		} catch (error: any) {
			consoleLogProduction(
				`ServerInit for ${process.env.MICROSERVICE_NAME} didn't execute.`,
				"error"
			);
		}
	} catch (error: any) {
		if (error.code == "ERR_MODULE_NOT_FOUND")
			consoleLogProduction(
				`ServerInit for ${process.env.MICROSERVICE_NAME} wasn't found.`,
				"error"
			);
		else
			consoleLogProduction(
				error,
				"error",
				`ServerInit for ${process.env.MICROSERVICE_NAME} didn't load.`
			);
	}

	// all microservices but globalData
	if (process.env.MICROSERVICE_NAME !== "globalData") {
		await Subscriber.subscribe("globalDataMessage"); // subscribe to "globalDataMessage" messages from "globalData"
		await Subscriber.psubscribe("serviceRegistry-responseInformation-*"); // handled in registerCurrentMicroservice()

		// register (if not registered already) microservice/app after globalData is registered
		Subscriber.on("message", async (channel, message) => {
			if (channel === "globalDataMessage") {
				if (message === "registered") {
					let serviceRegistryInfo =
						await requestServiceRegistryInfo();
					if (!serviceRegistryInfo) {
						consoleLogProduction(
							"Couldn't get serviceRegistry information.",
							"error"
						);
					}
					try {
						if (process.env.MICROSERVICE_NAME) {
							// microservice
							if (!process.env.MICROSERVICE_ID)
								await registerCurrentMicroservice();
							consoleLogProduction(
								`'${process.env.MICROSERVICE_NAME}' registered on 'globalData registered'.`,
								"success"
							);
						} else {
							// ? i think thins never happens. Apps has their own separate application
							// app
							if (!process.env.APP_ID) await registerCurrentApp();
							consoleLogProduction(
								`'${process.env.APP_NAME}' registered on 'globalData registered'.`,
								"success"
							);
						}
					} catch (error) {
						consoleLogProduction(
							`Couldn't register '${
								process.env.MICROSERVICE_NAME
									? process.env.MICROSERVICE_NAME
									: process.env.APP_NAME
							}' after 'globalData registered'.`,
							"error"
						);
					}
				}
			}
		});

		let serviceRegistryInfo = await requestServiceRegistryInfo();
		if (!serviceRegistryInfo) {
			consoleLogProduction(
				"Couldn't get serviceRegistry information.",
				"error"
			);
		}
		try {
			if (process.env.MICROSERVICE_NAME) {
				// microservice
				await registerCurrentMicroservice();
			} else {
				// app
				await registerCurrentApp();
			}
		} catch (error) {
			consoleLogProduction(
				`Couldn't register '${
					process.env.MICROSERVICE_NAME
						? process.env.MICROSERVICE_NAME
						: process.env.APP_NAME
				}'.`,
				"error"
			);
		}
	}

	// all microservices
}
