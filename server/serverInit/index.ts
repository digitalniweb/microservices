import { microservices } from "../../types/index.d.js";
import { customBELogger } from "./../../custom/helpers/logger.js";
import { serviceOptions } from "../../types/customFunctions/globalData.js";
// import serviceRegistryRedis from "../../custom/helpers/serviceRegistryRedis.js";

import Publisher from "./../../custom/helpers/publisherService.js";
import Subscriber from "./../../custom/helpers/subscriberService.js";

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
	let publisher = Publisher;

	// values from .env file - returns string (or undefined) everytime
	type serviceInfoType = {
		PORT: string | number;
		HOST: string;
		MICROSERVICE_UNIQUE_NAME: string;
		MICROSERVICE_NAME: string;
	};

	type serviceInfoParametersType = keyof serviceInfoType;

	let missingServiceInfo: serviceInfoParametersType[] = [];

	let serviceInfo = {} as serviceInfoType;

	let serviceInfoParameters: Array<serviceInfoParametersType> = [
		"PORT",
		"HOST",
		"MICROSERVICE_UNIQUE_NAME",
		"MICROSERVICE_NAME",
	];

	serviceInfoParameters.forEach((e) => {
		if (process.env[e] == undefined) missingServiceInfo.push(e);
		else serviceInfo[e] = process.env[e] as string;
	});

	if (serviceInfo["PORT"] !== undefined)
		serviceInfo["PORT"] = parseInt(serviceInfo["PORT"] as string);
	if (isNaN(serviceInfo["PORT"])) missingServiceInfo.push("PORT");

	if (missingServiceInfo.length !== 0) {
		customBELogger({
			message: `Couldn't register service ${
				process.env.MICROSERVICE_NAME
			}. ${missingServiceInfo.join(", ")} ${
				missingServiceInfo.length === 1 ? "is" : "are"
			} missing in .env file.`,
		});
		return false;
	}

	let service: serviceOptions = {
		port: serviceInfo["PORT"],
		host: serviceInfo["HOST"],
		uniqueName: serviceInfo["MICROSERVICE_UNIQUE_NAME"],
		name: serviceInfo["MICROSERVICE_NAME"],
	};

	let subscriber = Subscriber;
	console.log(await subscriber.subscribe("serviceRegistry-register"));

	subscriber.on("message", (channel, message) => {
		console.log(channel, message);
	});

	let serviceJSON = JSON.stringify(service);

	let serviceRegistry = await publisher.publish(
		"serviceRegistry-register",
		serviceJSON
	);
	console.log(serviceRegistry);

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
