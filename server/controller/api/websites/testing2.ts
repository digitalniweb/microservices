import { Request, Response, NextFunction } from "express";

// https://github.com/luin/ioredis/blob/HEAD/examples/ttl.js
// https://github.com/luin/ioredis
// import redis from "../../../../digitalniweb-custom/helpers/serverCache.js";
// By default, it will connect to localhost:6379.
import microserviceCall from "../../../../digitalniweb-custom/helpers/microserviceCall.js";
import { microserviceRegistryInfo } from "../../../../digitalniweb-types/customFunctions/globalData.js";
import { microservices } from "../../../../digitalniweb-types/index.js";

import Publisher from "../../../../digitalniweb-custom/helpers/publisherService.js";
import Subscriber from "../../../../digitalniweb-custom/helpers/subscriberService.js";

import events, { EventEmitter } from "node:events";

export const test = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		try {
			Publisher.publish(
				"serviceRegistry-responseService-mservice",
				"mservice message response"
			);

			return res.send("emmited");
		} catch (error) {
			return res.send(error);
		}
	} catch (error) {
		return next(error);
	}
};
