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
		// https://www.javatpoint.com/redis-all-commands (redis commands(not IoRedis'))
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
	hset(key: RedisKey, hashKey: string | number, ...fields: (RedisKey | number)[]) {
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
