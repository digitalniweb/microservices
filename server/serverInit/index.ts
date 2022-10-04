import { microservices } from "../../types";
import { customBELogger } from "./../../custom/helpers/logger";
export default async function () {
	let microservice = process.env.MICROSERVICE_NAME as microservices;
	try {
		const msInit = await import("./" + microservice);
		console.log(`ServerInit for ${process.env.MICROSERVICE_NAME} loaded.`);
		try {
			msInit.default();
			console.log(`ServerInit for ${process.env.MICROSERVICE_NAME} executed.`);
		} catch (error: any) {
			customBELogger({
				error,
				message: `ServerInit for ${process.env.MICROSERVICE_NAME} didn't execute.`,
			});
		}
	} catch (error: any) {
		if (error.code == "MODULE_NOT_FOUND")
			console.log(
				`ServerInit for ${process.env.MICROSERVICE_NAME} wasn't found.`
			);
		else
			customBELogger({
				error,
				message: `ServerInit for ${process.env.MICROSERVICE_NAME} didn't load.`,
			});
	}
}
