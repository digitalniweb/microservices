import db from "../../../server/models/index.js";

import Microservice from "../../../server/models/globalData/microservice.js";

import {
	serviceRegistry,
	microserviceRegistryInfo,
} from "../../../digitalniweb-types/customFunctions/globalData.js";
import ServiceRegistry from "../../../server/models/globalData/serviceRegistry.js";
import { microservices } from "../../../digitalniweb-types/index.js";
import { log } from "../../../digitalniweb-custom/helpers/logger.js";
import { getServiceRegistryServices as getServiceRegistryServicesType } from "../../../digitalniweb-types/custom/helpers/globalData/serviceRegistry.js";
import {
	getServiceRegistryInfo as getServiceRegistryInfoType,
	getMainServiceRegistry as getMainServiceRegistryType,
	registerService as registerServiceType,
	serviceRegistryList as serviceRegistryListType,
} from "../../../digitalniweb-types/custom/helpers/globalData/serviceRegistry.js";

export const registerService: registerServiceType = async (options) => {
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
};

export const serviceRegistryList: serviceRegistryListType = async () => {
	try {
		let list = await Microservice.findAll({
			include: {
				model: ServiceRegistry,
			},
		});

		if (list.length === 0) return {};
		let serviceRegistry: serviceRegistry = {};
		list.forEach((microservice) => {
			serviceRegistry[microservice.name] = {
				name: microservice.name,
				mainId: microservice.mainServiceRegistryId,
				services: microservice.ServiceRegistries ?? [],
			};
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
};

export const getServiceRegistryServices: getServiceRegistryServicesType =
	async (name) => {
		try {
			let service = await Microservice.findOne({
				where: { name },
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
export const getServiceRegistryInfo: getServiceRegistryInfoType = async () => {
	return await getServiceRegistryServices("globalData");
};

/**
 * @returns `globalData: Microservice`
 */
export const getMainServiceRegistry: getMainServiceRegistryType = async (
	microservice
) => {
	let ms = await Microservice.findOne({
		where: {
			name: microservice,
		},
	});
	return ms;
};
