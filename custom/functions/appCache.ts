import NodeCache from "node-cache";

class AppCache {
	static #_instance: AppCache;

	#cache;
	#namespaceSeparator = "###";

	constructor(ttlSeconds: number) {
		this.#cache = new NodeCache({
			stdTTL: ttlSeconds,
			checkperiod: ttlSeconds * 0.2,
			useClones: false,
		});
	}

	static getInstance() {
		if (!AppCache.#_instance) {
			AppCache.#_instance = new AppCache(300);
		}
		return AppCache.#_instance;
	}

	get(key: string, namespace = "") {
		key = `${namespace ? namespace + this.#namespaceSeparator : ""}${key}`;
		return this.#cache.get(key);
	}

	set(key: string, value: string, namespace: string) {
		key = `${namespace ? namespace + this.#namespaceSeparator : ""}${key}`;
		this.#cache.set(key, value);
	}

	has(key: string, namespace: string) {
		key = `${namespace ? namespace + this.#namespaceSeparator : ""}${key}`;
		return this.#cache.has(key);
	}

	del(key: string, namespace: string) {
		key = `${namespace ? namespace + this.#namespaceSeparator : ""}${key}`;
		this.#cache.del(key);
	}
	keys() {
		return this.#cache.keys();
	}
}

export default AppCache.getInstance();
