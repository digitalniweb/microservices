import Publisher from "./../../custom/helpers/publisherService";
import Subscriber from "./../../custom/helpers/subscriberService";
import cron from "node-cron";
import { billingModules } from "../../custom/helpers/billing";
export default async function () {
	let subscriber = Subscriber;
	console.log(await subscriber.subscribe("test-channel"));
	let publisher = Publisher;
	publisher.publish("test-channel", "test message");

	subscriber.on("message", (channel, message) => {
		console.log(`Received ${ message } from ${ channel }`);
	});

	console.log("websites serverInit");

	// billingModules();
	/* cron.schedule("0 2 * * *", () => {
		// 2 am every day
		billingModules();
	}); */
}
