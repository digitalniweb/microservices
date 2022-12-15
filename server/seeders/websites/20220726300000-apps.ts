import { QueryInterface } from "sequelize";

// import AppType from "../../models/global/appType.js";
import App from "../../models/websites/app.js";

import { microservices } from "../../../types/index.d.js";
import AppLanguage from "../../models/websites/appLanguage.js";
const microservice: Array<microservices> = ["websites"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		/* let saasHostType = await AppType.create({
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
		await saasTenant.setLanguages(languages); */

		// !!! languages And appTypeId must load from global
		let saasHost = await App.create({
			name: "webs",
			port: 3000,
			appTypeId: 1,
		});
		let saasTenant = await App.create({
			name: "webs-tenants",
			port: 3001,
			appTypeId: 2,
		});

		await saasHost.createAppLanguage({ languageId: 1 });
		await saasTenant.createAppLanguage({ languageId: 1 });

		/* await saasHost.setAppLanguages([
			await AppLanguage.create({ languageId: 1 }),
		]);
		await saasTenant.setAppLanguages([
			await AppLanguage.create({ languageId: 1 }),
		]); */
	},
	down: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			try {
				await queryInterface.bulkDelete(App.tableName, {}, { transaction });
				await queryInterface.bulkDelete(
					AppLanguage.tableName,
					{},
					{ transaction }
				);
				return;
			} catch (error) {
				console.log(error);
			}
		});
	},
};
