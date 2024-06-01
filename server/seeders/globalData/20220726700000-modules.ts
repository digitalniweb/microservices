import { QueryInterface } from "sequelize";

import { microservices } from "../../../digitalniweb-types/index.js";
// import Website from "../../models/globalData/website.js";
import Module from "../../models/globalData/module.js";
import Language from "../../models/globalData/language.js";
import ModulePage from "../../models/globalData/modulePage.js";
import ModulePageLanguage from "../../models/globalData/modulePageLanguage.js";
// import Url from "../../models/globalData/url.js";
// import { addDays } from "date-fns";
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
				// https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/
				let cs = await Language.findOne({ where: { code: "cs" } });
				let en = await Language.findOne({ where: { code: "en" } });

				// articles
				await Module.create(
					{
						name: "articles",
						model: "Article",
						component: "WebPagesArticle",
					},
					{ transaction }
				);

				// photoGallery
				await Module.create(
					{
						name: "photoGallery",
						model: "PhotoGallery",
						creditsCost: 30,
						ModulePages: [
							{
								name: "Photo gallery",
								component: "WebPagesPhotoGallery",
								url: "photogallery",
								ModulePageLanguages: [
									{
										LanguageId: cs?.id,
										url: "fotogalerie",
										name: "fotogalerie",
										title: "Fotogalerie",
										description: "Vytvořené fotogalerie",
										headline: "Fotogalerie",
									},
									{
										LanguageId: en?.id,
										url: "photogallery",
										name: "photo gallery",
										title: "Photo gallery",
										description: "Photo galleries",
										headline: "Photo gallery",
									},
								],
							},
						],
					},
					{
						include: [
							{
								model: ModulePage,
								include: [{ model: ModulePageLanguage }],
							},
						],
						transaction,
					}
				);

				// news
				await Module.create(
					{
						name: "news",
						model: "News",
						creditsCost: 30,
						ModulePages: [
							{
								name: "News",
								component: "WebPagesNews",
								url: "news",
								ModulePageLanguages: [
									{
										LanguageId: cs?.id,
										url: "novinky",
										name: "novinky",
										title: "Novinky",
										description:
											"Nejnovější zprávy a novinky",
										headline: "Novinky",
									},
									{
										LanguageId: en?.id,
										url: "news",
										name: "news",
										title: "News",
										description: "Latest news and updates",
										headline: "News",
									},
								],
							},
						],
					},
					{
						include: [
							{
								model: ModulePage,
								include: [{ model: ModulePageLanguage }],
							},
						],
						transaction,
					}
				);

				// invoices
				await Module.create({
					name: "invoices",
					model: "Invoice",
				});

				// users
				await Module.create(
					{
						name: "users",
						model: "User",
						ModulePages: [
							{
								name: "Login",
								component: "WebPagesLogin",
								url: "login",
								ModulePageLanguages: [
									{
										LanguageId: cs?.id,
										url: "prihlasit",
										name: "přihlásit",
										title: "Přihlášení uživatele",
										description: "Přihlášení uživatele",
										headline: "Přihlášení uživatele",
									},
									{
										LanguageId: en?.id,
										url: "login",
										name: "login",
										title: "User login",
										description: "User login",
										headline: "User login",
									},
								],
							},
							{
								name: "Logout",
								component: "WebPagesLogout",
								url: "logout",
								ModulePageLanguages: [
									{
										LanguageId: cs?.id,
										url: "odhlasit",
										name: "odhlásit",
										title: "Odhlášení uživatele",
										description: "Odhlášení uživatele",
										headline: "Odhlášení uživatele",
									},
									{
										LanguageId: en?.id,
										url: "logout",
										name: "logout",
										title: "User logout",
										description: "User logout",
										headline: "User logout",
									},
								],
							},
							{
								name: "Register",
								component: "WebPagesRegister",
								url: "register",
								ModulePageLanguages: [
									{
										LanguageId: cs?.id,
										url: "registrace",
										name: "registrace",
										title: "Registrace uživatele",
										description: "Registrace uživatele",
										headline: "Registrace uživatele",
									},
									{
										LanguageId: en?.id,
										url: "register",
										name: "register",
										title: "User registration",
										description: "User registration",
										headline: "User registration",
									},
								],
							},
							{
								name: "Profile",
								component: "WebPagesProfile",
								url: "profile",
								ModulePageLanguages: [
									{
										LanguageId: cs?.id,
										url: "profil",
										name: "profil",
										title: "Profil uživatele",
										description: "Profil uživatele",
										headline: "Profil uživatele",
									},
									{
										LanguageId: en?.id,
										url: "profile",
										name: "profile",
										title: "User profile",
										description: "User profile",
										headline: "User profile",
									},
								],
							},
						],
					},
					{
						include: [
							{
								model: ModulePage,
								include: [{ model: ModulePageLanguage }],
							},
						],
						transaction,
					}
				);

				// tenants
				await Module.create({
					name: "tenants",
					model: "Tenant",
				});

				/* if (process.env.NODE_ENV === "development") {
					let testWebsite = await Website.findOne({
						where: {
							"$MainUrl.url$": "digitalniweblocalhost.cz",
						},
						include: [
							{
								// where: {
								// 	url: "digitalniweblocalhost.cz",
								// },
								model: Url,
								as: "MainUrl",
								attributes: [],
							},
						],
					});

					
					// this works as well
					// if (testWebsite)
					// 	await photoGallery.setWebsites([testWebsite], {
					// 		through: { deletedAt: Date() },
					// 	});

					// if (testWebsite) await testWebsite.setModules([photoGallery]);

					let today = new Date();
					let billingDay = addDays(today, 14).getDate(); // 14 days for free
					if (testWebsite)
						await testWebsite.addModules([photoGallery, news], {
							through: { billingDay },
						});
				} */
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
					Module.tableName,
					{},
					{ transaction }
				);
			} catch (error) {
				console.log(error);
			}
		});
	},
};
