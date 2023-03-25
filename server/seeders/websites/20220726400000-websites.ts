import { QueryInterface } from "sequelize";
import { randomString } from "../../../digitalniweb-custom/functions/randomGenerator.js";

import { microservices } from "../../../digitalniweb-types/index.js";
import App from "../../models/globalData/app.js";
import Website from "../../models/websites/website.js";
const microservice: Array<microservices> = ["websites"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			try {
				return;
				let digitalniwebWebsite = await Website.create({
					uniqueName: randomString(14, false),
					active: true,
					testingMode: false,
					paused: false,
				});

				/* let czechLanguage = await Language.findOne({
					where: { code: "cs" },
				});
				let englishLanguage = await Language.findOne({
					where: { code: "en" },
				}); */

				// because of 'createUrlSetAlias' hook in Website model I don't need to call:
				// a) UrlInstance.setWebsite(digitalniwebWebsite) on this instance -> Url.WebsiteId = Website.id
				// or b) digitalniwebWebsite.setAlias(UrlInstance) -> Url.WebsiteId = Website.id
				// Url.WebsiteId = Website.id and Website.id = Url.WebsiteId
				// WebsiteInstance.createUrl(UrlObject) -> creates Url and assigns it to Website (changes Website model!) => Website.MainUrlId = Url.id
				// WebsiteInstance.setUrl(UrlInstance) -> assigns Website an already created Url
				if (process.env.NODE_ENV === "production") {
					await digitalniwebWebsite.createMainUrl({
						url: "digitalniweb.cz",
					});
				} else if (process.env.NODE_ENV === "development") {
					await digitalniwebWebsite.createMainUrl({
						url: "digitalniweblocalhost.cz",
					});
				}
				/* 
				// default language
				if (czechLanguage)
					await digitalniwebWebsite.setMainLanguage(czechLanguage);

				// language mutation
				if (englishLanguage)
					await digitalniwebWebsite.setLanguages([englishLanguage]); */

				let digitalniwebHost = await App.findOne({
					where: { name: "webs" },
				});

				if (digitalniwebHost)
					await digitalniwebWebsite.setApp(digitalniwebHost);

				let digitalniwebTenants = await App.findOne({
					where: { name: "webs-tenants" },
				});

				if (process.env.NODE_ENV === "development") {
					let digitalniwebTenantWebsite = await Website.create({
						uniqueName: "01234567891234",
						active: true,
						testingMode: false,
						paused: false,
					});
					if (digitalniwebTenants)
						await digitalniwebTenantWebsite.setApp(
							digitalniwebTenants
						);

					/* if (czechLanguage)
						await digitalniwebTenantWebsite.setMainLanguage(czechLanguage); */

					// only Url.WebsiteId = Website.id will happen (no Website.id = Url.WebsiteId)
					await digitalniwebWebsite.createAlias({
						url: "digitalniweblocalhost-alias.cz",
					});
				}
			} catch (error) {
				console.log(error);
			}
		});
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
					Website.tableName,
					{},
					{ transaction }
				);
			} catch (error) {
				console.log(error);
			}
		});
	},
};
