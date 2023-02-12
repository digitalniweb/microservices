import {
	microserviceRegistryInfo,
	serviceOptions,
	serviceRegistry,
} from "../../digitalniweb-types/customFunctions/globalData.js";
import { microservicesArray } from "../../digitalniweb-custom/variables/microservices.js";
import {
	microservices,
	serviceInfoParametersType,
	serviceInfoType,
} from "../../digitalniweb-types/index.js";
import { globalData } from "../../digitalniweb-types/models/globalData.js";
import appCache from "./appCache.js";
import microserviceCall from "./microserviceCall.js";
import { customBELogger } from "./logger.js";

import Publisher from "./../../digitalniweb-custom/helpers/publisherService.js";
import Subscriber from "./../../digitalniweb-custom/helpers/subscriberService.js";
import sleep from "../functions/sleep.js";

type getServiceOptions = {
	name: microservices;
	id?: number;
};

export async function setService(
	name: microservices,
	info: microserviceRegistryInfo
) {}

/**
 * returns main service or service by id from cache
 * @param options
 * @options `name`: service name
 * @options `id?`: service ID
 * @returns
 */
export async function getService(
	options: getServiceOptions
): Promise<globalData.ServiceRegistry | undefined> {
	const { name, id } = options;
	if (!serviceExists(name)) return undefined;
	let serviceRegistryCache: serviceRegistry | undefined =
		appCache.get("serviceRegistry");
	if (serviceRegistryCache === undefined) {
		try {
			await requestServiceRegistryInfo();
		} catch (error) {
			return undefined;
		}
		serviceRegistryCache = appCache.get("serviceRegistry");
	}

	if (serviceRegistryCache === undefined) return undefined;

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
	} else if (id) {
		service = serviceRegistryCache[name]?.services.find((e) => e.id == id);
	} else {
		service = serviceRegistryCache[name]?.services.find((e) => {
			if (serviceRegistryCache === undefined) return undefined;
			return e.id == serviceRegistryCache[name]?.mainId;
		});
	}

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
			if (e === "PORT") {
				if (Number.isInteger(Number(serviceInfo[e])))
					throw new Error(
						"Current's microservice PORT is not a number!"
					);
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

	await microserviceCall({
		microservice: "globalData",
		path: "/api/serviceregistry/register",
		data: service,
		method: "POST",
	});
}

/**
 * gets serviceRegistry information <microserviceRegistryInfo>
 * @returns void
 */
export async function requestServiceRegistryInfo(): Promise<boolean> {
	try {
		let response = await requestServiceRegistryInfoFromRedisEvent(
			Subscriber,
			"pmessage"
		);
		let serviceRegistryCache: serviceRegistry | undefined =
			appCache.get("serviceRegistry");
		if (serviceRegistryCache === undefined) serviceRegistryCache = {};
		serviceRegistryCache.globalData = response;
		appCache.set("serviceRegistry", serviceRegistryCache);
	} catch (error) {
		console.log(error);
		return false;
	}
	return true;
}

function requestServiceRegistryInfoFromRedisEvent(
	item: typeof Subscriber,
	event: string
): Promise<microserviceRegistryInfo> {
	return new Promise(async (resolve, reject) => {
		const listener = (
			pattern: string,
			channel: string,
			message: string
		) => {
			if (pattern === "serviceRegistry-responseInformation-*") {
				let requestedService = channel.replace(
					/^serviceRegistry-responseInformation-/,
					""
				);
				if (requestedService != process.env.MICROSERVICE_UNIQUE_NAME)
					return;
				item.off(event, listener);
				resolve(JSON.parse(message));
			}
		};

		item.on(event, listener);

		await Publisher.publish(
			"serviceRegistry-requestInformation",
			process.env.MICROSERVICE_UNIQUE_NAME
		);
		await sleep(3000);
		item.off(event, listener);
		reject("reject");
	});
}
