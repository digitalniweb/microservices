import { Request, Response, NextFunction } from "express";
import { getServiceRegistryServices } from "../../../../custom/helpers/globalData/serviceRegistry.js";
import { microservicesArray } from "../../../../custom/variables/microservices.js";
import { microservices } from "../../../../types/index.js";

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
