import {
	getServiceRegistryInfo,
	registerService,
} from "../../custom/helpers/globalData/serviceRegistry.js";
import { customBELogger } from "../../custom/helpers/logger.js";
import { serviceOptions } from "../../types/customFunctions/globalData.js";
import Publisher from "./../../custom/helpers/publisherService.js";
import Subscriber from "./../../custom/helpers/subscriberService.js";

export default async function () {
	Subscriber.on("message", async (channel, message) => {
		if (channel === "serviceRegistry-register") {
			try {
				let service: serviceOptions = JSON.parse(message);
				let serviceRegistered = await registerService(service);
				if (!serviceRegistered) {
					customBELogger({
						error: {
							message: `Error has occured while registering a service via Redis' "serviceRegistry-register" messaging system.`,
						},
					});
					return;
				}
				if (service.name === "globalData") return true;
				let serviceRegistryInfo = await getServiceRegistryInfo();
				if (!serviceRegistryInfo) {
					customBELogger({
						error: {
							message: `Couldn't get service registry information.`,
						},
					});
					return;
				}

				await Publisher.publish(
					`serviceRegistry-registred-${service.name}`,
					JSON.stringify(serviceRegistryInfo)
				);
			} catch (error) {
				customBELogger({
					error: {
						message: `Couldn't register a service via Redis' "serviceRegistry-register" messaging system because 'message' JSON couldn't be parsed.`,
					},
				});
			}
		}
	});
}
