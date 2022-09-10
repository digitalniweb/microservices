import { Request, Response, NextFunction } from "express";

// https://github.com/luin/ioredis/blob/HEAD/examples/ttl.js
// https://github.com/luin/ioredis
import Redis from "ioredis";
// By default, it will connect to localhost:6379.
const redis = new Redis();

export const test = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		/* console.log(redis.status);
		let redisGet = await redis.get("testkey");
		let returnValue = { getV: redisGet, setV: undefined };
		let redisSet: any;
		if (redisGet) redisSet = await redis.set("testkey", "testvalue");
		returnValue.setV = redisSet; */
		return res.send("ttl: " + (await redis.ttl("testkey")));
	} catch (error) {
		return next(error);
	}
};
