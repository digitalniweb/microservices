import IoRedis, { RedisKey, Callback, RedisValue } from "ioredis";

class ServerCache {
	static #_instance: ServerCache;

	#cache: IoRedis;

	constructor() {
		this.#cache = new IoRedis();
	}

	static getInstance(): ServerCache {
		if (!ServerCache.#_instance) {
			ServerCache.#_instance = new ServerCache();
		}
		return ServerCache.#_instance;
	}

	get(key: RedisKey, callback?: Callback) {
		return this.#cache.get(key, callback);
	}

	set(key: RedisKey, value: RedisValue, callback?: Callback) {
		return this.#cache.set(key, value, callback);
	}

	mset(object: object, callback?: Callback) {
		return this.#cache.mset(object, callback);
	}
}

export default ServerCache.getInstance();
