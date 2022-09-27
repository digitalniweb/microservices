import IoRedis from "ioredis";

class Redis {
	static #ioRedis: IoRedis;

	static ioRedis() {
		if (!Redis.#ioRedis) {
			Redis.#ioRedis = new IoRedis();
		}
		return Redis.#ioRedis;
	}
}

export default Redis.ioRedis();
