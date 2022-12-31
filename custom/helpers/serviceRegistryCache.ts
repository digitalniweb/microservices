import { serviceRegistry } from "../../types/customFunctions/globalData.js";
import { microservices, microservicesArray } from "../../types/index.js";
import { globalData } from "../../types/models/globalData.js";
import appCache from "./appCache.js";

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
	}
	if (id)
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
