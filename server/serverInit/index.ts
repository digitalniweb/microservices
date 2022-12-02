import { microservices } from "../../types/index.d.js";
import { customBELogger } from "./../../custom/helpers/logger.js";
import serviceRegistryRedis from "../../custom/serviceRegistryRedis.js";
export default async function () {
	let microservice = process.env.MICROSERVICE_NAME as microservices;
	try {
		const msInit = await import("./" + microservice);
		customBELogger({
			message: `ServerInit for ${process.env.MICROSERVICE_NAME} loaded.`,
		});
		try {
			msInit.default();
			customBELogger({
				message: `ServerInit for ${process.env.MICROSERVICE_NAME} executed.`,
			});
		} catch (error: any) {
			customBELogger({
				error,
				message: `ServerInit for ${process.env.MICROSERVICE_NAME} didn't execute.`,
			});
		}
	} catch (error: any) {
		if (error.code == "MODULE_NOT_FOUND")
			customBELogger({
				message: `ServerInit for ${process.env.MICROSERVICE_NAME} wasn't found.`,
			});
		else
			customBELogger({
				error,
				message: `ServerInit for ${process.env.MICROSERVICE_NAME} didn't load.`,
			});
	}
	if (await serviceRegistryRedis.register())
		customBELogger({
			message: `${process.env.MICROSERVICE_NAME} registered to service registry!`,
		});
	else
		customBELogger({
			error: {
				message: `Couldn't register ${process.env.MICROSERVICE_NAME} to service registry.`,
			},
		});

	/* let currentService = serviceRegistryRedis.getCurrentService();
	if (currentService !== false)
		console.log(await serviceRegistryRedis.find(currentService.name));
	console.log(await serviceRegistryRedis.list()); */
}
