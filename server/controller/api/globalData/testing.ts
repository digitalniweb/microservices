import { Request, Response, NextFunction } from "express";
import { log } from "../../../../digitalniweb-custom/helpers/logger.js";

// https://github.com/luin/ioredis/blob/HEAD/examples/ttl.js
// https://github.com/luin/ioredis
// import redis from "../../../../digitalniweb-custom/helpers/serverCache.js";
// By default, it will connect to localhost:6379.

export const test = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		log({
			type: "api",
			status: "error",
		});
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
		return res.send("ok");
	} catch (error) {
		return next(error);
	}
};
