import { registerService } from "../../custom/helpers/globalData/serviceRegistry.js";
import { customBELogger } from "../../custom/helpers/logger.js";
import { serviceOptions } from "../../types/customFunctions/globalData.js";
// import Publisher from "./../../custom/helpers/publisherService.js";
import Subscriber from "./../../custom/helpers/subscriberService.js";

export default async function () {
	Subscriber.on("message", async (channel, message) => {
		if (channel === "serviceRegistry-register") {
			try {
				let service: serviceOptions = JSON.parse(message);
				await registerService(service);
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
