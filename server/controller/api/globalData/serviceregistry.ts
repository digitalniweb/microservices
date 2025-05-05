import type { Request, Response, NextFunction } from "express";
import {
	getMainServiceRegistry,
	getServiceRegistryServices,
} from "../../../../custom/helpers/globalData/serviceRegistry.js";
import { microservicesArray } from "../../../../digitalniweb-custom/variables/microservices.js";
import type { microservices } from "../../../../digitalniweb-types/index.js";
import { registerService } from "../../../../custom/helpers/globalData/serviceRegistry.js";
import ServiceRegistry from "../../../models/globalData/serviceRegistry.js";

export const getServiceByName = async function (req: Request, res: Response) {
	let microservice = req.params.name as microservices;
	if (!microservicesArray.includes(microservice)) {
		res.send(false);
		return;
	}
	let service = await getServiceRegistryServices(microservice);
	res.send(service);
};

export const getMainServiceByName = async function (
	req: Request,
	res: Response
) {
	let name = req.params.name as microservices;
	if (!name) throw new Error("Service by name not found");
	let service = await getMainServiceRegistry(name);
	res.send(service);
};

export const getServiceById = async function (req: Request, res: Response) {
	let id = parseInt(req.params.id);
	if (!id) throw new Error("Service by id not found");
	let service = await ServiceRegistry.findOne({
		where: { id },
	});
	res.send(service);
};

export const register = async function (req: Request, res: Response) {
	let microservice = req.body.name as microservices;

	if (!microservicesArray.includes(microservice)) {
		res.send(false);
		return;
	}
	let service = await registerService(req.body);

	res.send(service);
};
