import axios, { AxiosResponse } from "axios";

import { Request } from "express";
import { HTTPMethods } from "../../types/httpMethods.js";
import { microservices } from "../../types/index.d.js";
import serviceRegistryRedis from "./serviceRegistryRedis.js";
import appCache from "./appCache.js";

interface msCallOptions {
	microservice: microservices;
	protocol?: string;
	host?: string;
	port?: number;
	path: string;
	method?: HTTPMethods;
	data?: { [key: string]: any };
	params?: { [key: string]: any };
}

export default async function microserviceCall(
	req: Request,
	options: msCallOptions
): Promise<AxiosResponse<any, any>["data"] | false> {
	// Primarily used for microservice calls
	const {
		microservice,
		protocol = "http",
		host = "localhost",
		port,
		path,
		method = "GET",
		data = {}, // POST data
		params = {}, // GET parameters (query)
	}: msCallOptions = options;

	let finalPath = "";
	// change to service registry (+ need to make service discovery) - microservice where the ports and urls (and protocol etc.) are stored + cache it for some time, don't call it every time
	if (microservice) {
		if (!appCache.has("serviceRegistry")) {
			let serviceRegistry = await serviceRegistryRedis.list();
			if (serviceRegistry !== undefined) {
				let serviceRegistryList = {};
				for (const service in serviceRegistry) {
					serviceRegistryList[service] = JSON.parse(serviceRegistry[service]);
				}
				appCache.set("serviceRegistry", serviceRegistryList);
			}
		}
		let serviceAppCache = appCache.get("serviceRegistry");
		if (serviceAppCache[microservice] === undefined) {
			return false;
		}
		let service = await serviceRegistryRedis.find(microservice);
		finalPath = `http://localhost:${service.port}`;
	} else {
		finalPath = `${protocol}://${host}${port ? ":" + port : port}`;
	}
	finalPath += path;

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
				req && req.headers["user-agent"] ? req.headers["user-agent"] : "ms",
		},
	});

	// axiosResponse throws error on axios error
	return axiosResponse.data;
}
