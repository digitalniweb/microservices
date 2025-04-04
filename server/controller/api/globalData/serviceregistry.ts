import { Request, Response, NextFunction } from "express";
import {
	getMainServiceRegistry,
	getServiceRegistryServices,
} from "../../../../custom/helpers/globalData/serviceRegistry.js";
import { microservicesArray } from "../../../../digitalniweb-custom/variables/microservices.js";
import { microservices } from "../../../../digitalniweb-types/index.js";
import { registerService } from "../../../../custom/helpers/globalData/serviceRegistry.js";
import ServiceRegistry from "../../../models/globalData/serviceRegistry.js";

export const getServiceByName = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let microservice = req.params.name as microservices;
		if (!microservicesArray.includes(microservice)) {
			res.send(false);
			return;
		}
		let service = await getServiceRegistryServices(microservice);
		res.send(service);
	} catch (error) {
		next({ error });
	}
};

export const getMainServiceByName = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let name = req.params.name as microservices;
		if (!name) {
			next({
				message: "Service by name not found",
				req,
			});
			return;
		}
		let service = await getMainServiceRegistry(name);
		res.send(service);
	} catch (error) {
		next({
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
		if (!id) {
			next({
				status: "warning",
				message: "Service by id not found",
				req,
			});
			return;
		}
		let service = await ServiceRegistry.findOne({
			where: { id },
		});
		res.send(service);
	} catch (error) {
		next({ error });
	}
};

export const register = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let microservice = req.body.name as microservices;

		if (!microservicesArray.includes(microservice)) {
			res.send(false);
			return;
		}
		let service = await registerService(req.body);

		res.send(service);
	} catch (error) {
		next({ error });
	}
};
