import IoRedis from "ioredis";

class Redis {
	static #ioRedis: IoRedis.default;

	static ioRedis(): IoRedis.default {
		if (!Redis.#ioRedis) {
			Redis.#ioRedis = new IoRedis.default();
		}
		return Redis.#ioRedis;
	}
}

export default Redis.ioRedis();
