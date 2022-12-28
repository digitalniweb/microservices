import { customBELogger } from "../../custom/helpers/logger.js";
// import Publisher from "./../../custom/helpers/publisherService.js";
import Subscriber from "./../../custom/helpers/subscriberService.js";

export default async function () {
	let subscriber = Subscriber;
	subscriber.on("message", (channel, message) => {
		if (channel === "serviceRegistry-register") {
			try {
				let service = JSON.parse(message);
				console.log(service);
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
