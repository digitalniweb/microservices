// !! not used. DELETE

import serverCache from "./serverCache.js";

type serviceName = string;
type service = {
	name: serviceName;
	port: number;
};

type serviceRegistry =
	| {
			[key: serviceName]: string;
	  }
	| undefined;

class ServiceRegistryRedis {
	static #_instance: ServiceRegistryRedis;

	#namespace = "serviceRegistry";

	#serviceRegistry: typeof serverCache;

	constructor() {
		this.#serviceRegistry = serverCache;
	}

	static getInstance(): ServiceRegistryRedis {
		if (!ServiceRegistryRedis.#_instance) {
			ServiceRegistryRedis.#_instance = new ServiceRegistryRedis();
		}
		return ServiceRegistryRedis.#_instance;
	}

	getCurrentService(): service | false {
		let name = process.env.MICROSERVICE_NAME;
		let port = process.env.PORT;
		if (name === undefined || port === undefined) return false;
		return {
			name,
			port,
		};
	}

	async register(): Promise<service | false> {
		let currentService = this.getCurrentService();
		if (!currentService) return false;
		let currentServiceJSON = JSON.stringify(currentService);
		let numberOfFieldsAdded = await this.#serviceRegistry.hset(
			this.#namespace,
			currentService.name,
			currentServiceJSON
		);

		if (numberOfFieldsAdded === 0) return false;
		return currentService;
	}

	async unregister(): Promise<boolean> {
		let currentService = this.getCurrentService();
		if (!currentService) return false;
		let numberOfFieldsDeleted = await this.#serviceRegistry.hdel(
			this.#namespace,
			currentService.name
		);
		if (numberOfFieldsDeleted == 0) return false;
		return true;
	}

	async find(name: serviceName): Promise<service> {
		let service = await this.#serviceRegistry.hget(this.#namespace, name);
		return service != null ? JSON.parse(service) : null;
	}

	async updateSelf() {
		return await this.register();
	}

	async list(): Promise<serviceRegistry> {
		let serviceRegistry = await this.#serviceRegistry.hgetall(
			this.#namespace
		);
		return serviceRegistry;
	}
}

export default ServiceRegistryRedis.getInstance();
