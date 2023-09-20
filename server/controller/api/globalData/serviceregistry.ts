import { Request, Response, NextFunction } from "express";
import {
	getMainServiceRegistry,
	getServiceRegistryServices,
} from "../../../../custom/helpers/globalData/serviceRegistry.js";
import { microservicesArray } from "../../../../digitalniweb-custom/variables/microservices.js";
import { microservices } from "../../../../digitalniweb-types/index.js";
import { registerService } from "../../../../custom/helpers/globalData/serviceRegistry.js";
import { send } from "process";

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
		return next({ error });
	}
};

export const getMainServiceByName = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let name = req.params.name as microservices;
		if (!name)
			return next({
				message: "Service by name not found",
				req,
			});
		let service = await getMainServiceRegistry(name);
		return res.send(service);
	} catch (error) {
		return next({
			error,
			req,
		});
	}
};

export const getServiceById = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let id = parseInt(req.params.id);
		if (!id)
			return next({
				status: "warning",
				message: "Service by id not found",
				req,
			});
		let service = await getServiceRegistryServices({
			id,
		});
		return res.send(service);
	} catch (error) {
		return next({ error });
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
		return next({ error });
	}
};
