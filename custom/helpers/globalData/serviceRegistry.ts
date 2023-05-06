import db from "../../../server/models/index.js";

import Microservice from "../../../server/models/globalData/microservice.js";

import {
	microserviceOptions,
	serviceRegistry,
	microserviceRegistryInfo,
} from "../../../digitalniweb-types/customFunctions/globalData.js";
import ServiceRegistry from "../../../server/models/globalData/serviceRegistry.js";
import { microservices } from "../../../digitalniweb-types/index.js";

export async function registerService(
	options: microserviceOptions
): Promise<boolean> {
	try {
		await db.transaction(async (transaction) => {
			let serviceRegistryCount = await ServiceRegistry.count({
				where: {
					uniqueName: options.uniqueName,
				},
				transaction,
			});

			if (serviceRegistryCount !== 0) return;

			let [microservice, microserviceCreated] =
				await Microservice.findOrCreate({
					where: {
						name: options.name,
					},
					transaction,
				});

			let serviceRegistry = await microservice.createServiceRegistry(
				{
					host: options.host,
					port: options.port,
					uniqueName: options.uniqueName,
					apiKey: options.apiKey,
				},
				{ transaction }
			);

			if (microserviceCreated)
				microservice.setMainServiceRegistry(serviceRegistry);
		});
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}

export async function serviceRegistryList(): Promise<serviceRegistry | false> {
	try {
		let list = await Microservice.findAll({
			include: {
				model: ServiceRegistry,
			},
		});

		if (list.length === 0) return {};
		let serviceRegistry: serviceRegistry = {};
		list.forEach((microservice) => {
			serviceRegistry[microservice.name as microservices] = {
				mainId: microservice.mainServiceRegistryId,
				services: microservice.ServiceRegistries,
			} as microserviceRegistryInfo;
		});
		return serviceRegistry;
	} catch (error) {
		console.log(error);
		return false;
	}
}
