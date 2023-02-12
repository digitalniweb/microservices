import IoRedis, {
	RedisKey,
	Callback,
	RedisValue,
	RedisCommander,
} from "ioredis";
import { customBELogger } from "./logger.js";

class ServerCache {
	static #_instance: ServerCache;

	#cache: IoRedis.default;

	// number of errors occurred
	#errors: { [key: string]: number } = {};

	// if IoRedis is not disconnected, then it tries to connect to Redis indefinitely
	#disconnectOnCrash: boolean = false;
	#disconnectNumberOfTries: number = 20;

	constructor() {
		// https://www.javatpoint.com/redis-all-commands (redis commands(not IoRedis'))
		this.#cache = new IoRedis.default();
		this.#cache.on("error", (e) => {
			if (!(e.code in this.#errors)) {
				this.#errors[e.code] = 0;
			}
			this.#errors[e.code]++;
			if (e.code === "ECONNREFUSED") {
				let disconnectedMessage = `Microservice '${process.env.MICROSERVICE_NAME}' can't connect to Redis!`;
				if (this.#disconnectOnCrash) {
					if (this.#errors[e.code] >= this.#disconnectNumberOfTries) {
						// !!! there should also be some kind of notification in here that redis isn't working on this microservice
						customBELogger({
							error: {
								message: disconnectedMessage,
							},
						});
						this.#cache.disconnect();
					}
				} else {
					if (this.#errors[e.code] == this.#disconnectNumberOfTries) {
						// !!! there should also be some kind of notification in here that redis isn't working on this microservice
						customBELogger({
							error: {
								message: disconnectedMessage,
							},
						});
					}
				}
			}
		});

		this.#cache.on("connect", () => {
			if ("ECONNREFUSED" in this.#errors)
				delete this.#errors["ECONNREFUSED"];
			customBELogger({
				message: `Redis connected to '${process.env.MICROSERVICE_NAME}'`,
			});
		});
	}

	async connect() {
		try {
			this.#cache.connect();
		} catch (error) {
			customBELogger({
				error,
				message: `Microservice '${process.env.MICROSERVICE_NAME}' couldn't connect to Redis!`,
			});
		}
	}

	static getInstance(): ServerCache {
		if (!ServerCache.#_instance) {
			ServerCache.#_instance = new ServerCache();
		}
		return ServerCache.#_instance;
	}

	get(key: RedisKey, callback?: Callback) {
		let args = [...arguments] as Parameters<RedisCommander["get"]>;
		return this.#cache.get(...args);
	}

	set(key: RedisKey, value: RedisValue, callback?: Callback) {
		let args = [...arguments] as Parameters<RedisCommander["set"]>;
		return this.#cache.set(...args);
	}

	mset(object: object, callback?: Callback) {
		let args = [...arguments] as Parameters<RedisCommander["mset"]>;
		return this.#cache.mset(...args);
	}
	hset(
		key: RedisKey,
		hashKey: string | number,
		...fields: (RedisKey | number)[]
	) {
		let args = [...arguments] as Parameters<RedisCommander["hset"]>;
		return this.#cache.hset(...args);
	}
	hmset(key: RedisKey, object: object, callback?: Callback) {
		let args = [...arguments] as Parameters<RedisCommander["hmset"]>;
		return this.#cache.hmset(...args);
	}

	hget(key: RedisKey, field: RedisKey, callback?: Callback) {
		let args = [...arguments] as Parameters<RedisCommander["hget"]>;
		return this.#cache.hget(...args);
	}

	hmget(key: RedisKey, ...fields: RedisKey[]) {
		let args = [...arguments] as Parameters<RedisCommander["hmget"]>;
		return this.#cache.hmget(...args);
	}

	hgetall(key: RedisKey, callback?: Callback) {
		let args = [...arguments] as Parameters<RedisCommander["hgetall"]>;
		return this.#cache.hgetall(...args);
	}

	hdel(key: RedisKey, ...fields: RedisKey[]) {
		let args = [...arguments] as Parameters<RedisCommander["hdel"]>;
		return this.#cache.hdel(...args);
	}
}

export default ServerCache.getInstance();
