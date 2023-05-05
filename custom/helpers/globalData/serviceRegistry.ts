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

/**
 *
 * @returns `globalData: microserviceRegistryInfo` service information: id, host, port, apiKey etc.
 */
export async function getServiceRegistryInfo(): Promise<
	microserviceRegistryInfo | false
> {
	try {
		let serviceRegistry = await Microservice.findOne({
			where: {
				name: "globalData",
			},
			attributes: ["mainServiceRegistryId"],
			include: {
				model: ServiceRegistry,
			},
		});

		if (
			serviceRegistry === null ||
			serviceRegistry.ServiceRegistries === undefined
		)
			return false;

		let serviceRegistryInfo: microserviceRegistryInfo = {
			name: "globalData",
			mainId: serviceRegistry.mainServiceRegistryId as number,
			services: serviceRegistry.ServiceRegistries,
		};
		return serviceRegistryInfo;
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

export async function getServiceRegistryServices(options: {
	name?: microservices;
	id?: number;
}): Promise<microserviceRegistryInfo | undefined | false> {
	try {
		let where;
		if (options.id !== undefined) where = { id: options.id };
		else if (options.name) where = { name: options.name };
		else return false;
		let service = await Microservice.findOne({
			where,
			include: {
				model: ServiceRegistry,
			},
		});

		if (service === null || service.ServiceRegistries === undefined)
			return undefined;

		let serviceInfo: microserviceRegistryInfo = {
			mainId: service.mainServiceRegistryId,
			name: service.name,
			services: service.ServiceRegistries,
		};
		return serviceInfo;
	} catch (error) {
		console.log(error);
		return false;
	}
}