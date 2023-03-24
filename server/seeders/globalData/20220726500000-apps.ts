import { QueryInterface } from "sequelize";

import AppType from "../../models/globalData/appType.js";
import App from "../../models/globalData/app.js";

import { microservices } from "../../../digitalniweb-types/index.js";
import AppLanguage from "../../models/globalData/appLanguage.js";
import Language from "../../models/globalData/language.js";
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

		// !!! languages And appTypeId must load from globalData
		let saasHostType = await AppType.findOne({
			where: {
				name: "saas-host",
			},
		});
		let saasTenantType = await AppType.findOne({
			where: {
				name: "saas-tenant",
			},
		});

		if (!saasHostType || !saasTenantType) return;

		let czech = await Language.findOne({
			where: {
				code: "cs",
			},
		});
		let english = await Language.findOne({
			where: {
				code: "en",
			},
		});

		if (!czech || !english) return;

		let saasHostObject = await App.build({
			name: "webs",
			port: 3000,
			host: "localhost",
			uniqueName: "123456",
			apiKey: "123",
			AppTypeId: saasHostType.id,
			LanguageId: english.id,
		});

		let saasTenantObject = await App.build({
			name: "webs-tenants",
			port: 3001,
			host: "localhost",
			uniqueName: "789012",
			apiKey: "456",
			AppTypeId: saasTenantType.id,
			LanguageId: english.id,
		});

		let saasTenant = await saasTenantObject.save();
		let saasHost = await saasHostObject.save();

		saasTenant.setParent(saasHost);

		await saasHost.setLanguages([czech, english]);
		await saasTenant.setLanguages([czech, english]);

		/* await saasHost.createAppLanguage({ languageId: 1 });
		await saasTenant.createAppLanguage({ languageId: 1 }); */
	},
	down: async (queryInterface: QueryInterface): Promise<void> => {
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			try {
				await queryInterface.bulkDelete(
					App.tableName,
					{},
					{ transaction }
				);
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
