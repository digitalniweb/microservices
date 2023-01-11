import {
	microserviceRegistryInfo,
	serviceOptions,
	serviceRegistry,
} from "../../types/customFunctions/globalData.js";
import { microservicesArray } from "../variables/microservices.js";
import {
	microservices,
	serviceInfoParametersType,
	serviceInfoType,
} from "../../types/index.js";
import { globalData } from "../../types/models/globalData.js";
import appCache from "./appCache.js";
import microserviceCall from "./microserviceCall.js";
import { customBELogger } from "./logger.js";

import Publisher from "./../../custom/helpers/publisherService.js";
import Subscriber from "./../../custom/helpers/subscriberService.js";
import sleep from "../functions/sleep.js";

type getServiceOptions = {
	name: microservices;
	id?: number;
};
export async function getService(
	options: getServiceOptions
): Promise<globalData.ServiceRegistry | undefined> {
	const { name, id } = options;
	if (!serviceExists(name)) return undefined;
	if (!appCache.has("serviceRegistry")) {
		// need to call pub/sub Redis to get "globalData" info (where service registry is saved)
	}
	let serviceRegistryCache: serviceRegistry = appCache.get("serviceRegistry");
	let service = {} as globalData.ServiceRegistry | undefined;
	if (serviceRegistryCache[name] === undefined) {
		// try to get information about microservice from service registry
		// !!! need to add serviceregistry to 'globalData' ms
		service = (await microserviceCall({
			microservice: "globalData",
			path: `/api/serviceregistry?service=${name}`,
		})) as globalData.ServiceRegistry | undefined;
		if (!service) return undefined;
		serviceRegistryCache[name] =
			serviceRegistryCache as microserviceRegistryInfo;
	} else if (id)
		service = serviceRegistryCache[name]?.services.find((e) => e.id == id);
	else
		service = serviceRegistryCache[name]?.services.find(
			(e) => e.id == serviceRegistryCache[name]?.mainId
		);
	return service;
}

export function serviceExists(service: microservices): boolean {
	return microservicesArray.includes(service);
}

export async function registerCurrentService() {
	let missingServiceInfo: serviceInfoParametersType[] = [];

	let serviceInfo = {} as serviceInfoType;

	let serviceInfoParameters: Array<serviceInfoParametersType> = [
		"PORT",
		"HOST",
		"MICROSERVICE_UNIQUE_NAME",
		"MICROSERVICE_NAME",
		"MICROSERVICE_API_KEY",
	];

	serviceInfoParameters.forEach((e) => {
		if (process.env[e] == undefined) missingServiceInfo.push(e);
		else {
			// when you don't need anything else but assigning values in this block as in this case I can use this 'as string' hack
			// otherwise use code in following comment
			// serviceInfo[e as string] = process.env[e];

			// but if I wanted to use types and work with the variables inside this block I'd need to use following code. So the intellisense, TS and everything work as expected
			if (e === "PORT") {
				if (Number.isInteger(Number(serviceInfo[e])))
					throw new Error("Current's microservice PORT is not a number!");
				serviceInfo[e] = process.env[e];
			} else if (e === "MICROSERVICE_NAME") {
				serviceInfo[e] = process.env[e];
			} else {
				// else value type === 'string'
				serviceInfo[e] = process.env[e];
			}
		}
	});

	if (missingServiceInfo.length !== 0) {
		/* customBELogger({
			message: `Couldn't register service ${
				process.env.MICROSERVICE_NAME
			}. ${missingServiceInfo.join(", ")} ${
				missingServiceInfo.length === 1 ? "is" : "are"
			} missing in .env file.`,
		}); */
		throw new Error(
			`Couldn't register service ${
				process.env.MICROSERVICE_NAME
			}. ${missingServiceInfo.join(", ")} ${
				missingServiceInfo.length === 1 ? "is" : "are"
			} missing in .env file.`
		);
	}

	let service: serviceOptions = {
		port: serviceInfo["PORT"],
		host: serviceInfo["HOST"],
		uniqueName: serviceInfo["MICROSERVICE_UNIQUE_NAME"],
		name: serviceInfo["MICROSERVICE_NAME"],
		apiKey: serviceInfo["MICROSERVICE_API_KEY"],
	};
	let serviceJSON = JSON.stringify(service);

	/* microserviceCall({
		microservice: "globalData",
		path: "",
	}); */

	// await Publisher.publish("serviceRegistry-register", serviceJSON);
}

export async function requestServiceRegistryInfo(): Promise<boolean> {
	try {
		let response = await requestServiceRegistryInfoFromRedisEvent(
			Subscriber,
			"pmessage"
		);
		console.log(response);
	} catch (error) {}
	return true;
}

function requestServiceRegistryInfoFromRedisEvent(
	item: typeof Subscriber,
	event: string
) {
	return new Promise(async (resolve, reject) => {
		const listener = (pattern: string, channel: string, message: string) => {
			if (pattern === "serviceRegistry-responseInformation-*") {
				let requestedService = channel.replace(
					/^serviceRegistry-responseInformation-/,
					""
				);
				if (requestedService != process.env.MICROSERVICE_UNIQUE_NAME) return;
				item.off(event, listener);
				resolve(message);
			}
		};

		item.on(event, listener);
		Publisher.publish(
			"serviceRegistry-requestInformation",
			process.env.MICROSERVICE_UNIQUE_NAME
		);
		await sleep(3000);
		reject("reject");
	});
}
