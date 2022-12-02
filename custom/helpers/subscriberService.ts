import IoRedis, { RedisCommander } from "ioredis";
import EventEmitter from "events";

class Subscriber {
	static #_instance: Subscriber;

	#subscriber;

	constructor() {
		this.#subscriber = new IoRedis.default();
	}

	static getInstance(): Subscriber {
		if (!Subscriber.#_instance) {
			Subscriber.#_instance = new Subscriber();
		}
		return Subscriber.#_instance;
	}

	subscribe<Type extends Parameters<RedisCommander["subscribe"]>>(
		...args: Type
	) {
		return this.#subscriber.subscribe(...args);
	}

	on<Type extends Parameters<EventEmitter["on"]>>(
		event: Type[0],
		listener: Type[1]
	) {
		return this.#subscriber.on(event, listener);
	}
}

export default Subscriber.getInstance();
