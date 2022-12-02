import Publisher from "./../../custom/helpers/publisherService.js";
import Subscriber from "./../../custom/helpers/subscriberService.js";
import cron from "node-cron";
import { billingModules } from "../../custom/helpers/billing.js";

export default async function () {
	/* let subscriber = Subscriber;
	await subscriber.subscribe("test-channel");
	let publisher = Publisher;
	publisher.publish("test-channel", "test message");

	subscriber.on("message", (channel, message) => {
		console.log(`Received ${ message } from ${ channel }`);
	}); */

	console.log("websites serverInit");

	// billingModules();
	/* cron.schedule("0 2 * * *", () => {
		// 2 am every day
		billingModules();
	}); */
}
