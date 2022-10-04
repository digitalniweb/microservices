import IoRedis, {
	RedisKey,
	Callback,
	RedisValue,
	RedisCommander,
} from "ioredis";

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
}

export default ServerCache.getInstance();
