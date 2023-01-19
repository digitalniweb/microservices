import { microservices } from "../../types/index.d.js";
import { customBELogger } from "./../../custom/helpers/logger.js";

import Subscriber from "./../../custom/helpers/subscriberService.js";

import {
	registerCurrentService,
	requestServiceRegistryInfo,
} from "../../custom/helpers/serviceRegistryCache.js";

export default async function () {
	let microservice = process.env.MICROSERVICE_NAME as microservices;
	try {
		const msInit = await import("./" + microservice + ".js");
		customBELogger({
			message: `ServerInit for ${process.env.MICROSERVICE_NAME} loaded.`,
		});
		try {
			msInit.default();
			customBELogger({
				message: `ServerInit for ${process.env.MICROSERVICE_NAME} executed.`,
			});
		} catch (error: any) {
			customBELogger({
				error,
				message: `ServerInit for ${process.env.MICROSERVICE_NAME} didn't execute.`,
			});
		}
	} catch (error: any) {
		if (error.code == "MODULE_NOT_FOUND")
			customBELogger({
				message: `ServerInit for ${process.env.MICROSERVICE_NAME} wasn't found.`,
			});
		else
			customBELogger({
				error,
				message: `ServerInit for ${process.env.MICROSERVICE_NAME} didn't load.`,
			});
	}

	// all microservices but globalData
	if (process.env.MICROSERVICE_NAME !== "globalData") {
		await Subscriber.psubscribe("serviceRegistry-responseInformation-*"); // handled in registerCurrentService()
		let serviceRegistryInfo = await requestServiceRegistryInfo();
		if (!serviceRegistryInfo)
			throw new Error("Couldn't get serviceRegistry information.");

		await registerCurrentService();
	}

	// all microservices
}
