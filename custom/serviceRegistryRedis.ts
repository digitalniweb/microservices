import serverCache from "./helpers/serverCache";

type service = {
	port: number;
};

type serviceRegistry = {
	[key: string]: service;
};

export default class ServiceRegistryRedis {
	constructor() {}

	register(): boolean {
		let serviceName = process.env.MICROSERVICE_NAME || process.env.SERVICE_NAME;
		return true;
	}

	unregister(): boolean {
		let serviceName = process.env.MICROSERVICE_NAME || process.env.SERVICE_NAME;
		return true;
	}

	find(serviceName: string): service {
		let service = {
			port: 3001,
		};
		return service;
	}

	update() {}

	list(): serviceRegistry {
		let serviceRegistry: serviceRegistry = {
			testService: {
				port: 3001,
			},
		};
		return serviceRegistry;
	}
}
