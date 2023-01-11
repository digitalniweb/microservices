import { microservices } from "../../types/index.d.js";
import { customBELogger } from "./../../custom/helpers/logger.js";
import {
	microserviceRegistryInfo,
	serviceOptions,
	serviceRegistry,
} from "../../types/customFunctions/globalData.js";
// import serviceRegistryRedis from "../../custom/helpers/serviceRegistryRedis.js";

import Publisher from "./../../custom/helpers/publisherService.js";
import Subscriber from "./../../custom/helpers/subscriberService.js";

import events, { EventEmitter } from "node:events";

import appCache from "../../custom/helpers/appCache.js";
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

	// all microservices

	/* await Subscriber.subscribe("serviceRegistry-register");
	await Subscriber.psubscribe("serviceRegistry-responseService-*"); */

	Subscriber.on("pmessage", (pattern, channel, message) => {
		if (pattern === "serviceRegistry-registered-*") {
			let intendedService = channel.replace(/^serviceRegistry-registered-/, "");
			if (intendedService !== process.env.MICROSERVICE_UNIQUE_NAME) return;
			let globalData = {} as microserviceRegistryInfo;
			try {
				globalData = JSON.parse(message);
			} catch (error) {
				customBELogger({
					error,
					message: `Couldn't resolve "${process.env.MICROSERVICE_NAME}-${intendedService}" JSON of "serviceRegistry-registered-" messaging system.`,
				});
				return false;
			}
			let serviceRegistryCache: serviceRegistry | undefined =
				appCache.get("serviceRegistry");
			if (serviceRegistryCache === undefined) serviceRegistryCache = {};
			serviceRegistryCache.globalData = globalData;
			appCache.set("serviceRegistry", serviceRegistryCache);
		} /* else if (pattern === "serviceRegistry-responseService-*") {
			let requestedService = channel.replace(
				/^serviceRegistry-responseService-/,
				""
			);
			// if (requestService != process.env.MICROSERVICE_UNIQUE_NAME) return;
			// let requestedService: microserviceRegistryInfo;
			try {
				// requestedService = JSON.parse(message);
				console.log(message);
				let eventEmitter = new events.EventEmitter();
				let test = eventEmitter.emit("eventEmitter", message);
				console.log("test", test);
			} catch (error) {
				return error;
			}
		} */
	});

	let serviceRegistryInfo = await requestServiceRegistryInfo();
	if (!serviceRegistryInfo)
		throw new Error("Couldn't get serviceRegistry information.");

	await registerCurrentService();

	/* if (await serviceRegistryRedis.register())
		customBELogger({
			message: `${process.env.MICROSERVICE_NAME} registered to service registry!`,
		});
	else
		customBELogger({
			error: {
				message: `Couldn't register ${process.env.MICROSERVICE_NAME} to service registry.`,
			},
		}); */

	/* let currentService = serviceRegistryRedis.getCurrentService();
	if (currentService !== false)
		console.log(await serviceRegistryRedis.find(currentService.name));
	console.log(await serviceRegistryRedis.list()); */
}
