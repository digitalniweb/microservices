import { Request, Response, NextFunction } from "express";

// https://github.com/luin/ioredis/blob/HEAD/examples/ttl.js
// https://github.com/luin/ioredis
import redis from "../../../../custom/helpers/redis";
// By default, it will connect to localhost:6379.

export const test = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		console.log(redis.status);
		await redis.mset({ k1: "v1", k2: "v2" });
		let redisGet = await redis.get("testkey");
		let returnValue = { getV: redisGet, setV: undefined };
		let redisSet: any;
		if (!redisGet) {
			redisSet = await redis.set("testkey", "testvalue");
			returnValue.getV = await redis.get("testkey");
		}
		returnValue.setV = redisSet;

		return res.send(returnValue);
	} catch (error) {
		return next(error);
	}
};
