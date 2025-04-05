import { QueryInterface } from "sequelize";

import type { microservices } from "../../../digitalniweb-types/index.js";
import Module from "../../models/globalData/module.js";
import Language from "../../models/globalData/language.js";
import ModulePageLanguage from "../../models/globalData/modulePageLanguage.js";
const microservice: Array<microservices> = ["globalData"];

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
				let cs = await Language.findOne({ where: { code: "cs" } });
				let en = await Language.findOne({ where: { code: "en" } });

				let saasHostModule = await Module.create({
					name: "saasHost",
				});

				if (saasHostModule) {
					await saasHostModule.createModulePage(
						{
							name: "Tenant's websites list",
							component: "WebPagesSaasHostTenantsWebsitesList",
							url: "my-websites",
							ModulePageLanguages: [
								{
									LanguageId: cs?.id,
									name: "moje webové stránky",
									url: "moje-webove-stranky",
									title: "Moje webové stránky",
									description: "Seznam mých webových stránek",
									headline: "Moje webové stránky",
								},
								{
									LanguageId: en?.id,
									name: "my websites",
									url: "my-websites",
									title: "My websites",
									description: "List of my websites",
									headline: "My websites",
								},
							],
						},
						{
							include: [
								{
									model: ModulePageLanguage,
								},
							],
							transaction,
						}
					);
					await saasHostModule.createModulePage(
						{
							name: "Create tenant's website login",
							component:
								"WebPagesSaasHostTenantsCreateWebsiteLogin",
							url: "create-website-login",
							ModulePageLanguages: [
								{
									LanguageId: cs?.id,
									name: "přihlásit/registrovat se",
									url: "vytvorit-webove-stranky-prihlaseni",
									title: "Vytvořit webové stránky - přihlásit / registrovat",
									description:
										"Pro vytvoření webových stránek je notné se přihlásit nebo registrovat.",
									headline:
										"Vytvořit webové stránky - přihlásit / registrovat",
								},
								{
									LanguageId: en?.id,
									name: "login/register",
									url: "create-website-login",
									title: "Create website - login / register",
									description:
										"In order to create a website you need to login in or register first.",
									headline:
										"Create website - login / register",
								},
							],
						},
						{
							include: [
								{
									model: ModulePageLanguage,
								},
							],
							transaction,
						}
					);
					await saasHostModule.createModulePage(
						{
							name: "Create tenant's website",
							component: "WebPagesSaasHostTenantsCreateWebsite",
							url: "create-website",
							ModulePageLanguages: [
								{
									LanguageId: cs?.id,
									name: "vytvořit webové stránky",
									url: "vytvorit-webove-stranky",
									title: "Vytvořit webové stránky",
									description: "Vytvoření webových stránek.",
									headline: "Vytvořit webové stránky",
								},
								{
									LanguageId: en?.id,
									name: "create website",
									url: "create-website",
									title: "Create website",
									description: "Create a website.",
									headline: "Create website",
								},
							],
						},
						{
							include: [
								{
									model: ModulePageLanguage,
								},
							],
							transaction,
						}
					);
					await saasHostModule.createModulePage(
						{
							name: "Tenant's website info",
							component: "WebPagesTenantsWebsiteInfo",
							url: "website-info",
							ModulePageLanguages: [
								{
									LanguageId: cs?.id,
									name: "Informace webové stránky",
									url: "informace-webove-stranky",
									title: "Informace webové stránky",
									description: "Informace o webové stránce.",
									headline: "Informace webové stránky",
								},
								{
									LanguageId: en?.id,
									name: "website information",
									url: "website-info",
									title: "Website information",
									description: "Website's information.",
									headline: "Website information",
								},
							],
						},
						{
							include: [
								{
									model: ModulePageLanguage,
								},
							],
							transaction,
						}
					);
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
				await Module.destroy({
					where: {
						name: "saasHost",
					},
					transaction,
				});
			} catch (error) {
				console.log(error);
			}
		});
	},
};
