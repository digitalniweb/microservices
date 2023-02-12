import axios, { AxiosResponse } from "axios";

import { Request } from "express";
import { HTTPMethods } from "../../digitalniweb-types/httpMethods.js";
import { microservicesArray } from "../../digitalniweb-custom/variables/microservices.js";
import { microservices } from "../../digitalniweb-types/index.js";
import appCache from "./appCache.js";
import {
	getService,
	requestServiceRegistryInfo,
} from "./serviceRegistryCache.js";

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
	if (microservice === process.env.MICROSERVICE_NAME) {
		console.log(
			"You don't need to call 'microserviceCall' for same microservice."
		);
		return false;
	}

	let service = await getService({
		name: microservice,
	});

	if (service === undefined) return false;
	let finalPath =
		`${protocol}://${service.host}:${service.port}` +
		(path[0] !== "/" ? "/" : "") +
		path;

	let headers = {};
	if (req)
		headers = {
			"x-forwarded-for":
				req && req.headers["x-forwarded-for"]
					? (req.headers["x-forwarded-for"] as string)
					: "ms",
			"user-agent":
				req && req.headers["user-agent"]
					? req.headers["user-agent"]
					: "ms",
		};

	let axiosResponse = await axios.default({
		url: finalPath,
		method,
		data,
		params,
		headers,
	});

	// axiosResponse throws error on axios error
	return axiosResponse.data;
}
