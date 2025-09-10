import { registerService } from "../../custom/helpers/globalData/serviceRegistry.js";

export default async function () {
	let globalDataService = await registerService({
		host: process.env.HOST,
		name: process.env.MICROSERVICE_NAME,
		port: Number(process.env.PORT),
		uniqueName: process.env.MICROSERVICE_UNIQUE_NAME,
		apiKey: process.env.MICROSERVICE_API_KEY,
	});

	if (globalDataService)
		process.env.MICROSERVICE_ID = globalDataService.id.toString();
}
