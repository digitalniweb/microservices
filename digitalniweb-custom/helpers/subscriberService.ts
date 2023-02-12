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

	/**
	 *
	 * @param args arguments:
	 * - `pattern` regex channel
	 * - callback
	 * @returns number of channels this client is currently subscribed to.
	 */
	psubscribe<Type extends Parameters<RedisCommander["psubscribe"]>>(
		...args: Type
	) {
		return this.#subscriber.psubscribe(...args);
	}

	on<Type extends Parameters<EventEmitter["on"]>>(
		event: Type[0],
		listener: Type[1]
	) {
		return this.#subscriber.on(event, listener);
	}
	off<Type extends Parameters<EventEmitter["off"]>>(
		event: Type[0],
		listener: Type[1]
	) {
		return this.#subscriber.off(event, listener);
	}
}

export default Subscriber.getInstance();
