import IoRedis, { RedisCommander } from "ioredis";
import EventEmitter from "events";

class Publisher {
	static #_instance: Publisher;

	#publisher: IoRedis.default;

	constructor() {
		this.#publisher = new IoRedis.default();
	}

	static getInstance(): Publisher {
		if (!Publisher.#_instance) {
			Publisher.#_instance = new Publisher();
		}
		return Publisher.#_instance;
	}

	/**
	 *
	 * @param channel
	 * @param message
	 * @param callback
	 * @returns number of subscribers to this channel
	 */
	async publish<Type extends Parameters<RedisCommander["publish"]>>(
		channel: Type[0],
		message: Type[1],
		callback?: Type[2]
	) {
		let args = [...arguments] as Parameters<RedisCommander["publish"]>;

		return await this.#publisher.publish(...args);
	}

	on<Type extends Parameters<EventEmitter["on"]>>(
		event: Type[0],
		listener: Type[1]
	) {
		return this.#publisher.on(event, listener);
	}
}

export default Publisher.getInstance();
