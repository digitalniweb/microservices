import axios from "axios";

import { Request } from "express";
import { HTTPMethods } from "../../types/httpMethods";
import { microservices } from "../../types";

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
) {
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
		let microservicesMap = {
			users: "http://localhost:3030",
			websites: "http://localhost:3031",
		};
		if (!(microservice in microservicesMap))
			throw `There is no such microservice '${microservice}'`;
		finalPath = microservicesMap[microservice];
	} else {
		finalPath = `${protocol}://${host}${port ? ":" + port : port}`;
	}
	finalPath += path;

	let axiosResponse = await axios({
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
