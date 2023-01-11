import { Request, Response, NextFunction } from "express";
import sleep from "../../../../custom/functions/sleep.js";

// https://github.com/luin/ioredis/blob/HEAD/examples/ttl.js
// https://github.com/luin/ioredis
// import redis from "../../../../custom/helpers/serverCache.js";
// By default, it will connect to localhost:6379.
import microserviceCall from "../../../../custom/helpers/microserviceCall.js";
import { microserviceRegistryInfo } from "../../../../types/customFunctions/globalData.js";
import { microservices } from "../../../../types/index.js";

import Publisher from "./../../../../custom/helpers/publisherService.js";
import Subscriber from "./../../../../custom/helpers/subscriberService.js";

export const test = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		/* await redis.mset({ k1: "v1", k2: "v2" });
		let redisGet = await redis.get("testkey");
		let returnValue = { getV: redisGet, setV: undefined };
		let redisSet: any;
		if (!redisGet) {
			redisSet = await redis.set("testkey", "testvalue");
			returnValue.getV = await redis.get("testkey");
		}
		returnValue.setV = redisSet;

		return res.send(returnValue); */
		try {
			function getPromiseFromEvent(item: typeof Subscriber, event: string) {
				return new Promise(async (resolve, reject) => {
					const listener = (
						pattern: string,
						channel: string,
						message: string
					) => {
						console.log(pattern);

						if (pattern === "serviceRegistry-responseService-*") {
							let requestedService = channel.replace(
								/^serviceRegistry-responseService-/,
								""
							);
							/* if (requestedService != process.env.MICROSERVICE_UNIQUE_NAME)
								return; */
							item.off(event, listener);
							resolve(message);
						}
					};

					item.on(event, listener);

					await sleep(3000);
					reject("reject");
				});
			}

			let response = await getPromiseFromEvent(Subscriber, "pmessage");
			console.log(response);

			/* let requestedService: microservices = "globalData";
			let publishGetService = await Publisher.publish(
				"serviceRegistry-requestService-" +
					process.env.MICROSERVICE_UNIQUE_NAME,
				requestedService
			);
			// Publisher.publish("serviceRegistry-requestService-aaa", "-aaa");
			Publisher.publish("serviceRegistry-responseService-aaa", "-aaa");
			// if (publishGetService == 0) return false; */

			return res.send("globalData");
		} catch (error) {
			return res.send(error);
		}
		let service = await microserviceCall({
			microservice: "globalData",
			path: "/api/testing/",
		});
		return res.send(service);
	} catch (error) {
		return next(error);
	}
};
