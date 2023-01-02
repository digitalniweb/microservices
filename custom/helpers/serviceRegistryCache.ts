import {
	microserviceRegistryInfo,
	serviceRegistry,
} from "../../types/customFunctions/globalData.js";
import { microservicesArray } from "../variables/microservices.js";
import { microservices } from "../../types/index.js";
import { globalData } from "../../types/models/globalData.js";
import appCache from "./appCache.js";
import microserviceCall from "./microserviceCall.js";

type serviceOptions = {
	name: microservices;
	id?: number;
};
export async function getService(
	options: serviceOptions
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
