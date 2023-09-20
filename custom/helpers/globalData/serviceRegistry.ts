import db from "../../../server/models/index.js";

import Microservice from "../../../server/models/globalData/microservice.js";
import { Microservice as MicroserviceType } from "../../../digitalniweb-types/models/globalData.js";

import {
	microserviceOptions,
	serviceRegistry,
	microserviceRegistryInfo,
} from "../../../digitalniweb-types/customFunctions/globalData.js";
import ServiceRegistry from "../../../server/models/globalData/serviceRegistry.js";
import { microservices } from "../../../digitalniweb-types/index.js";
import { log } from "../../../digitalniweb-custom/helpers/logger.js";

export async function registerService(
	options: microserviceOptions
): Promise<false | ServiceRegistry> {
	try {
		let service = await db.transaction(async (transaction) => {
			let serviceRegistry = await ServiceRegistry.findOne({
				where: {
					uniqueName: options.uniqueName,
				},
				transaction,
			});

			if (serviceRegistry !== null) return serviceRegistry;

			let [microservice, microserviceCreated] =
				await Microservice.findOrCreate({
					where: {
						name: options.name,
					},
					transaction,
				});

			serviceRegistry = await microservice.createServiceRegistry(
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
			return serviceRegistry;
		});
		return service;
	} catch (error: any) {
		log({
			type: "functions",
			status: "error",
			error,
		});
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
	} catch (error: any) {
		log({
			type: "functions",
			status: "error",
			error,
		});
		return false;
	}
}

export const getServiceRegistryServices = async (options: {
	name?: microservices;
	id?: number;
}): Promise<microserviceRegistryInfo | undefined | false> => {
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
	} catch (error: any) {
		log({
			type: "functions",
			status: "error",
			error,
		});
		return false;
	}
};
/**
 *
 * @returns `globalData: microserviceRegistryInfo` service information: id, host, port, apiKey etc.
 */
export async function getServiceRegistryInfo(): Promise<
	microserviceRegistryInfo | false | undefined
> {
	return await getServiceRegistryServices({ name: "globalData" });
}

/**
 * @returns `globalData: Microservice`
 */
export async function getMainServiceRegistry(
	microservice: microservices
): Promise<MicroserviceType | null> {
	let ms = await Microservice.findOne({
		where: {
			name: microservice,
		},
	});
	return ms;
}
