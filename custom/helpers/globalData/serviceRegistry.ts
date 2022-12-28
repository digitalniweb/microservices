import db from "../../../server/models/index.js";

import Microservice from "../../../server/models/globalData/microservice.js";

import {
	serviceOptions,
	serviceRegistry,
} from "../../../types/customFunctions/globalData.js";
import ServiceRegistry from "../../../server/models/globalData/serviceRegistry.js";

export async function registerService(options: serviceOptions): Promise<void> {
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
				},
				{ transaction }
			);

			if (microserviceCreated)
				microservice.setMainServiceRegistry(serviceRegistry);
		});
	} catch (error) {
		console.log(error);
	}
}

export async function serviceRegistryList() {
	try {
		let list = await Microservice.findAll({
			include: {
				model: ServiceRegistry,
			},
		});

		if (list.length === 0) return [];
		let serviceRegistry: serviceRegistry = {};
		list.forEach((microservice) => {
			serviceRegistry[microservice.name] = {
				mainId: microservice.mainServiceRegistryId,
				services: microservice.ServiceRegistries,
			};
		});
		return serviceRegistry;
	} catch (error) {
		console.log(error);
	}
}
