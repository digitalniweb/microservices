import Publisher from "./../../digitalniweb-custom/helpers/publisherService.js";
import Subscriber from "./../../digitalniweb-custom/helpers/subscriberService.js";
import cron from "node-cron";

export default async function () {
	/*
	await Subscriber.subscribe("test-channel");
	Publisher.publish("test-channel", "test message");

	subscriber.on("message", (channel, message) => {
		console.log(`Received ${ message } from ${ channel }`);
	}); */
	// billingModules();
	/* cron.schedule("0 2 * * *", () => {
		// 2 am every day
		billingModules();
	}); */
}
