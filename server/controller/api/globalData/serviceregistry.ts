import { Request, Response, NextFunction } from "express";
import {
	getServiceRegistryInfo,
	getServiceRegistryServices,
} from "../../../../digitalniweb-custom/helpers/serviceRegistry.js";
import { microservicesArray } from "../../../../digitalniweb-custom/variables/microservices.js";
import { microservices } from "../../../../digitalniweb-types/index.js";
import { registerService } from "../../../../custom/helpers/globalData/serviceRegistry.js";

export const getServiceByName = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let microservice = req.params.name as microservices;
		if (!microservicesArray.includes(microservice)) return res.send(false);
		let service = await getServiceRegistryServices({ name: microservice });
		return res.send(service);
	} catch (error) {
		return next(error);
	}
};

export const getServiceById = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let id = parseInt(req.params.id);
		if (!id) return res.send(false);
		let service = await getServiceRegistryServices({
			id,
		});
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
