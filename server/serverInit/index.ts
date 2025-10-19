import type { microservices } from "../../digitalniweb-types/index.js";

import Publisher from "./../../digitalniweb-custom/helpers/publisherService.js";
import Subscriber from "./../../digitalniweb-custom/helpers/subscriberService.js";

import fs from "fs";

import path from "path";
import { pathToFileURL } from "url";
import { getServiceRegistryInfo } from "../../custom/helpers/globalData/serviceRegistry.js";
import { consoleLogProduction } from "../../digitalniweb-custom/helpers/logger.js";
import {
	registerCurrentApp,
	registerCurrentMicroservice,
	requestServiceRegistryInfo,
} from "../../digitalniweb-custom/helpers/serviceRegistryCache.js";

// import loadModels from "../loadModels.js";

export default async function () {
	let microservice = process.env.MICROSERVICE_NAME as microservices;

	// load all service's models
	// await loadModels();
	try {
		const msInit = await import("./" + microservice + ".js");
		consoleLogProduction(
			`ServerInit for ${process.env.MICROSERVICE_NAME} loaded.`,
			"success"
		);
		try {
			await msInit.default();
			consoleLogProduction(
				`ServerInit for ${process.env.MICROSERVICE_NAME} executed.`,
				"success"
			);
		} catch (error: any) {
			consoleLogProduction(
				`ServerInit for ${process.env.MICROSERVICE_NAME} didn't execute.`,
				"error"
			);
		}
	} catch (error: any) {
		if (error.code == "ERR_MODULE_NOT_FOUND")
			consoleLogProduction(
				`ServerInit for ${process.env.MICROSERVICE_NAME} wasn't found.`,
				"error"
			);
		else
			consoleLogProduction(
				error,
				"error",
				`ServerInit for ${process.env.MICROSERVICE_NAME} didn't load.`
			);
	}

	// subscribe now and on connect to everything
	if (process.env?.MICROSERVICE_NAME === "globalData")
		pubSubServiceInitGlobalData();
	else pubSubServiceInitMicroservices();
	Subscriber.on("connect", () => {
		if (process.env?.MICROSERVICE_NAME === "globalData")
			pubSubServiceInitGlobalData();
		else pubSubServiceInitMicroservices();
	});

	// all microservices
}

/**
 * Registers default pubs and subs to all microservices but globalData
 * @returns void
 */
async function pubSubServiceInitMicroservices() {
	if (process.env.MICROSERVICE_NAME === "globalData") return;
	try {
		await Subscriber.subscribe("globalDataMessage"); // subscribe to "globalDataMessage" messages from "globalData"
		await Subscriber.psubscribe("serviceRegistry-responseInformation-*"); // handled in registerCurrentMicroservice()

		// register (if not registered already) microservice/app after globalData is registered
		Subscriber.on("message", async (channel, message) => {
			if (channel === "globalDataMessage") {
				if (message === "registered") {
					let serviceRegistryInfo =
						await requestServiceRegistryInfo();
					if (!serviceRegistryInfo) {
						consoleLogProduction(
							"Couldn't get serviceRegistry information.",
							"error"
						);
					}
					try {
						if (!process.env.MICROSERVICE_ID)
							await registerCurrentMicroservice();
						consoleLogProduction(
							`'${process.env.MICROSERVICE_NAME}' registered on 'globalData registered'.`,
							"success"
						);
					} catch (error) {
						consoleLogProduction(
							`Couldn't register '${
								process.env.MICROSERVICE_NAME
									? process.env.MICROSERVICE_NAME
									: process.env.APP_NAME
							}' after 'globalData registered'.`,
							"error"
						);
					}

					try {
						let assocFile = path.resolve(
							process.cwd(),
							`dist/server/models/${process.env.MICROSERVICE_NAME}/associationsGlobalData.js`
						);

						if (fs.existsSync(assocFile)) {
							let assocFileUrl = pathToFileURL(assocFile);
							let associationsGlobalData = await import(
								assocFileUrl.href
							);
							associationsGlobalData.createAssociationsGlobalData();
						}
					} catch (error) {
						consoleLogProduction(
							error,
							"error",
							`Associations dependent on 'globalData' of '${
								process.env.MICROSERVICE_NAME
									? process.env.MICROSERVICE_NAME
									: process.env.APP_NAME
							}' after 'Subscriber service connected' failed.`
						);
					}
				}
			}
		});

		let serviceRegistryInfo = await requestServiceRegistryInfo();
		if (!serviceRegistryInfo) {
			consoleLogProduction(
				"Couldn't get serviceRegistry information.",
				"error"
			);
		}
		if (process.env.MICROSERVICE_NAME) {
			// microservice
			await registerCurrentMicroservice();
		} else {
			// app
			await registerCurrentApp();
		}
	} catch (error) {
		consoleLogProduction(
			error,
			"error",
			`Couldn't register '${
				process.env.MICROSERVICE_NAME
					? process.env.MICROSERVICE_NAME
					: process.env.APP_NAME
			}'.`
		);
	}
}
/**
 * Registers default pubs and subs to globalData ms
 * @returns void
 */
async function pubSubServiceInitGlobalData() {
	await Subscriber.subscribe("serviceRegistry-requestInformation");
	await Publisher.publish("globalDataMessage", "registered");
	Subscriber.on("message", async (channel, message) => {
		if (channel === "serviceRegistry-requestInformation") {
			try {
				let serviceUniqueName: string = message; // 'app' or 'microservice'
				let serviceRegistryInfo = await getServiceRegistryInfo();
				if (!serviceRegistryInfo) {
					consoleLogProduction(
						"Couldn't get service registry information.",
						"error"
					);

					return;
				}

				await Publisher.publish(
					`serviceRegistry-responseInformation-${serviceUniqueName}`,
					JSON.stringify(serviceRegistryInfo)
				);
			} catch (error: any) {
				consoleLogProduction(
					error,
					"error",
					`Couldn't obtain serviceRegistry information via "serviceRegistry-requestInformation" Redis messaging system.'`
				);
			}
		}
	});
}
