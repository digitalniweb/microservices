import axios, { AxiosResponse } from "axios";

import { Request } from "express";
import { HTTPMethods } from "../../types/httpMethods.js";
import { microservicesArray } from "../variables/microservices.js";
import { microservices } from "../../types/index.d.js";
import serviceRegistryRedis from "./serviceRegistryRedis.js";
import appCache from "./appCache.js";
import { getService } from "./serviceRegistryCache.js";

interface msCallOptions {
	microservice: microservices;
	req?: Request;
	protocol?: string;
	serviceId?: number;
	path: string;
	method?: HTTPMethods;
	data?: { [key: string]: any };
	params?: { [key: string]: any };
}

export default async function microserviceCall(
	options: msCallOptions
): Promise<AxiosResponse<any, any>["data"] | false> {
	// Primarily used for microservice calls
	const {
		req,
		microservice,
		serviceId,
		protocol = "http",
		path,
		method = "GET",
		data = {}, // POST data
		params = {}, // GET parameters (query)
	}: msCallOptions = options;

	if (!microservicesArray.includes(microservice)) return false;
	if (microservice === process.env.MICROSERVICE_NAME)
		if (microservice) {
			if (!appCache.has("serviceRegistry")) {
				let serviceRegistry = await serviceRegistryRedis.list();
				if (serviceRegistry !== undefined) {
					let serviceRegistryList = {};
					for (const service in serviceRegistry) {
						serviceRegistryList[service] = JSON.parse(
							serviceRegistry[service]
						);
					}
					appCache.set("serviceRegistry", serviceRegistryList);
				}
			}
			let serviceAppCache = appCache.get("serviceRegistry");
			if (serviceAppCache[microservice] === undefined) {
				return false;
			}
			let service = await getService({
				name: microservice,
			});
		}
	let finalPath =
		`${protocol}://${process.env.HOST}:${process.env.PORT}` + path;

	let axiosResponse = await axios.default({
		url: finalPath,
		method,
		data,
		params,
		headers: {
			"x-forwarded-for":
				req && req.headers["x-forwarded-for"]
					? (req.headers["x-forwarded-for"] as string)
					: "ms",
			"user-agent":
				req && req.headers["user-agent"]
					? req.headers["user-agent"]
					: "ms",
		},
	});

	// axiosResponse throws error on axios error
	return axiosResponse.data;
}
