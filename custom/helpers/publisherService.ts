import IoRedis, { RedisCommander } from "ioredis";
import EventEmitter from "events";

class Publisher {
	static #_instance: Publisher;

	#publisher: IoRedis;

	constructor() {
		this.#publisher = new IoRedis();
	}

	static getInstance(): Publisher {
		if (!Publisher.#_instance) {
			Publisher.#_instance = new Publisher();
		}
		return Publisher.#_instance;
	}

	publish<Type extends Parameters<RedisCommander["publish"]>>(
		channel: Type[0],
		message: Type[1],
		callback: Type[2]
	) {
		return this.#publisher.publish(channel, message, callback);
	}

	on<Type extends Parameters<EventEmitter["on"]>>(
		event: Type[0],
		listener: Type[1]
	) {
		return this.#publisher.on(event, listener);
	}
}

export default Publisher.getInstance();
