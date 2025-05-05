import { registerService } from "../../custom/helpers/globalData/serviceRegistry.js";
import Publisher from "./../../digitalniweb-custom/helpers/publisherService.js";
import Subscriber from "./../../digitalniweb-custom/helpers/subscriberService.js";
import { getServiceRegistryInfo } from "./../../custom/helpers/globalData/serviceRegistry.js";
import { consoleLogProduction } from "../../digitalniweb-custom/helpers/logger.js";

export default async function () {
	let globalDataService = await registerService({
		host: process.env.HOST,
		name: process.env.MICROSERVICE_NAME,
		port: process.env.PORT,
		uniqueName: process.env.MICROSERVICE_UNIQUE_NAME,
		apiKey: process.env.MICROSERVICE_API_KEY,
	});

	if (globalDataService) process.env.MICROSERVICE_ID = globalDataService.id;

	await Subscriber.subscribe("serviceRegistry-requestInformation");
	await Publisher.publish("globalDataMessage", "registered");
	Subscriber.on("message", async (channel, message) => {
		if (channel === "serviceRegistry-requestInformation") {
			try {
				let serviceUniqueName: string = message; // 'app' or 'microservice'
				let serviceRegistryInfo = await getServiceRegistryInfo();
				if (!serviceRegistryInfo) {
					consoleLogProduction(
						"Couldn't get service registry information.",
						"error"
					);

					return;
				}

				await Publisher.publish(
					`serviceRegistry-responseInformation-${serviceUniqueName}`,
					JSON.stringify(serviceRegistryInfo)
				);
			} catch (error: any) {
				consoleLogProduction(
					error,
					"error",
					`Couldn't obtain serviceRegistry information via "serviceRegistry-requestInformation" Redis messaging system.'`
				);
			}
		}
	});
}
