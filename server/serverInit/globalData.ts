import { getServiceRegistryInfo } from "../../custom/helpers/globalData/serviceRegistry.js";
import { customBELogger } from "../../digitalniweb-custom/helpers/logger.js";
import Publisher from "./../../digitalniweb-custom/helpers/publisherService.js";
import Subscriber from "./../../digitalniweb-custom/helpers/subscriberService.js";

export default async function () {
	await Subscriber.subscribe("serviceRegistry-requestInformation");
	await Subscriber.on("message", async (channel, message) => {
		if (channel === "serviceRegistry-requestInformation") {
			try {
				let serviceUniqueName: string = message;
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
					`serviceRegistry-responseInformation-${serviceUniqueName}`,
					JSON.stringify(serviceRegistryInfo)
				);
			} catch (error) {
				customBELogger({
					error: {
						message: `Couldn't obtain serviceRegistry information via "serviceRegistry-requestInformation" Redis messaging system.`,
					},
				});
			}
		}
	});
}
