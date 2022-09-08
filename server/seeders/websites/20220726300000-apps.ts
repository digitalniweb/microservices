import { QueryInterface } from "sequelize";

import Language from "../../models/websites/language";
import AppType from "../../models/websites/appType";
import App from "../../models/websites/app";

import { microservices } from "../../../types";
const microservice: Array<microservices> = ["websites"];

export = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		let saasHostType = await AppType.create({
			name: "saas-host",
		});
		let saasTenantType = await AppType.create({
			name: "saas-tenant",
		});
		let saasHost = await saasHostType.createApp({
			name: "webs",
			port: 3000,
		});
		let saasTenant = await saasTenantType.createApp({
			name: "webs-tenants",
			port: 3001,
		});
		saasTenant.setParent(saasHost);

		let languages = await Language.findAll();

		await saasHost.setLanguages(languages);
		await saasTenant.setLanguages(languages);
	},
	down: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			try {
				return await queryInterface.bulkDelete(
					App.tableName,
					{},
					{ transaction }
				);
			} catch (error) {
				console.log(error);
			}
		});
	},
};
