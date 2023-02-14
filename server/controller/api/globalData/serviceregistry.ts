import { Request, Response, NextFunction } from "express";
import { getServiceRegistryServices } from "../../../../custom/helpers/globalData/serviceRegistry.js";
import { microservicesArray } from "../../../../digitalniweb-custom/variables/microservices.js";
import { microservices } from "../../../../digitalniweb-types/index.js";
import {
	getServiceRegistryInfo,
	registerService,
} from "../../../../custom/helpers/globalData/serviceRegistry.js";

export const getService = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let microservice = req.query.service as microservices;
		if (!microservicesArray.includes(microservice)) return res.send(false);
		let service = await getServiceRegistryServices(microservice);
		return res.send(service);
	} catch (error) {
		return next(error);
	}
};

export const register = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let microservice = req.body.name as microservices;

		if (!microservicesArray.includes(microservice)) return res.send(false);
		let service = await registerService(req.body);

		return res.send(service);
	} catch (error) {
		return next(error);
	}
};
