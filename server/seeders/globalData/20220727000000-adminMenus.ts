import { QueryInterface } from "sequelize";

import type { microservices } from "../../../digitalniweb-types/index.js";
import AdminMenu from "../../models/globalData/adminMenu.js";
import Module from "../../models/globalData/module.js";
import Language from "../../models/globalData/language.js";
import AdminMenuLanguage from "../../models/globalData/adminMenuLanguage.js";
import Role from "../../models/globalData/role.js";
const microservice: Array<microservices> = ["globalData"];

/* 
npm run buildSequelize
npx sequelize-cli db:migrate:undo --name '20230604000000-adminMenuModules.js'
npx sequelize-cli db:migrate:undo --name '20230602000000-adminMenuLanguages.js'
npx sequelize-cli db:migrate:undo --name '20230601000000-adminMenus.js'
npm run migrations
npx sequelize-cli db:seed --seed '20220727000000-adminMenus.js'
*/

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
				let roleAdmin = await Role.findOne({
					where: { name: "admin" },
					transaction,
				});
				// let roleOwner = await Role.findOne({
				// 	where: { name: "owner" },
				// 	transaction,
				// });
				let roleSuperadmin = await Role.findOne({
					where: { name: "superadmin" },
					transaction,
				});

				let cs = await Language.findOne({
					where: { code: "cs" },
					transaction,
				});
				let en = await Language.findOne({
					where: { code: "en" },
					transaction,
				});

				let articlesModule = await Module.findOne({
					where: {
						name: "articles",
					},
					transaction,
				});
				let webInformationModule = await Module.findOne({
					where: {
						name: "webInformation",
					},
					transaction,
				});

				let superadminModule = await Module.findOne({
					where: {
						name: "superadmin",
					},
					transaction,
				});

				if (superadminModule) {
					let superadminSeparator = await AdminMenu.create(
						{
							name: "superadminSeparator",
							openable: false,
							order: 100,
							icon: "mdi-shield-account-outline",
							separator: true,
							RoleId: roleSuperadmin?.id,
						},
						{ transaction }
					);

					await superadminSeparator.addModule(superadminModule, {
						transaction,
					});

					let superadminModulesOpener = await AdminMenu.create(
						{
							name: "superadminModulesOpener",
							openable: true,
							order: 101,
							icon: "mdi-view-dashboard-outline",
							RoleId: roleSuperadmin?.id,
						},
						{ transaction }
					);
					await superadminModulesOpener.addModules(
						[superadminModule],
						{ transaction }
					);

					if (superadminSeparator) {
						await superadminSeparator.createAdminMenuLanguage(
							{
								name: "Superadmin",
								url: "superadmin",
								LanguageId: en?.id,
							},
							{ transaction }
						);
						await superadminSeparator.createAdminMenuLanguage(
							{
								name: "Superadmin",
								url: "superadmin",
								LanguageId: cs?.id,
							},
							{ transaction }
						);
					}

					if (superadminModulesOpener) {
						let superadminAppModules =
							await superadminModulesOpener.createChild(
								{
									name: "superadminAppModules",
									component: "AdminSuperadminAppModules",
									openable: true,
									order: 0,
									icon: "mdi-view-dashboard-edit-outline",
									RoleId: roleSuperadmin?.id,
								},
								{ transaction }
							);
						await superadminAppModules.addModules(
							[superadminModule],
							{ transaction }
						);

						await superadminModulesOpener.createAdminMenuLanguage(
							{
								name: "Modules",
								url: "superadmin/modules",
								LanguageId: en?.id,
							},
							{ transaction }
						);

						await superadminModulesOpener.createAdminMenuLanguage(
							{
								name: "Moduly",
								url: "superadmin/moduly",
								LanguageId: cs?.id,
							},
							{ transaction }
						);

						await superadminAppModules.createAdminMenuLanguage(
							{
								name: "App modules",
								url: "superadmin/modules/appmodules",
								LanguageId: en?.id,
							},
							{ transaction }
						);

						await superadminAppModules.createAdminMenuLanguage(
							{
								name: "Moduly aplikace",
								url: "superadmin/moduly/moduly-aplikace",
								LanguageId: cs?.id,
							},
							{ transaction }
						);
					}

					let superadminLanguagesOpener = await AdminMenu.create(
						{
							name: "superadminLanguagesOpener",
							openable: true,
							order: 102,
							icon: "mdi-account-voice",

							RoleId: roleSuperadmin?.id,
						},
						{ transaction }
					);
					await superadminLanguagesOpener.addModules(
						[superadminModule],
						{ transaction }
					);
					if (superadminLanguagesOpener) {
						let superadminAppLanguages =
							await superadminModulesOpener.createChild(
								{
									name: "superadminAppLanguages",
									component: "AdminSuperadminAppLanguages",
									openable: false,
									order: 0,
									icon: "mdi-account-voice",
									RoleId: roleSuperadmin?.id,
								},
								{ transaction }
							);
						await superadminModulesOpener.addModules(
							[superadminModule],
							{ transaction }
						);

						await superadminLanguagesOpener.createAdminMenuLanguage(
							{
								name: "Languages",
								url: "superadmin/languages",
								LanguageId: en?.id,
							},
							{ transaction }
						);
						await superadminLanguagesOpener.createAdminMenuLanguage(
							{
								name: "Jazyky",
								url: "superadmin/jazyky",
								LanguageId: cs?.id,
							},
							{ transaction }
						);

						await superadminAppLanguages.createAdminMenuLanguage(
							{
								name: "App languages",
								url: "superadmin/languages/applanguages",
								LanguageId: en?.id,
							},
							{ transaction }
						);
						await superadminAppLanguages.createAdminMenuLanguage(
							{
								name: "Jazyky aplikace",
								url: "superadmin/jazyky/jazyky-aplikace",
								LanguageId: cs?.id,
							},
							{ transaction }
						);
					}
					let superadminWidgetsOpener = await AdminMenu.create(
						{
							name: "superadminWidgetsOpener",
							openable: true,
							order: 103,
							icon: "mdi-dots-grid",

							RoleId: roleSuperadmin?.id,
						},
						{ transaction }
					);
					await superadminWidgetsOpener.addModules(
						[superadminModule],
						{ transaction }
					);

					if (superadminWidgetsOpener) {
						let superadminAppWidgets =
							await superadminWidgetsOpener.createChild(
								{
									name: "superadminAppWidgets",
									component: "AdminSuperadminAppWidgets",
									openable: true,
									order: 0,
									icon: "mdi-dots-grid",
									RoleId: roleSuperadmin?.id,
								},
								{ transaction }
							);
						await superadminAppWidgets.addModules(
							[superadminModule],
							{ transaction }
						);

						await superadminWidgetsOpener.createAdminMenuLanguage(
							{
								name: "Widgets",
								url: "superadmin/widgets",
								LanguageId: en?.id,
							},
							{ transaction }
						);
						await superadminWidgetsOpener.createAdminMenuLanguage(
							{
								name: "Widgety",
								url: "superadmin/widgety",
								LanguageId: cs?.id,
							},
							{ transaction }
						);

						await superadminAppWidgets.createAdminMenuLanguage(
							{
								name: "App widgets",
								url: "superadmin/widgets/appwidgets",
								LanguageId: en?.id,
							},
							{ transaction }
						);

						await superadminAppWidgets.createAdminMenuLanguage(
							{
								name: "Widgety aplikace",
								url: "superadmin/widgety/widgety-aplikace",
								LanguageId: cs?.id,
							},
							{ transaction }
						);
					}

					let superadminAdminmenusOpener = await AdminMenu.create(
						{
							name: "superadminAdminmenusOpener",
							openable: true,
							order: 104,
							icon: "mdi-menu",

							RoleId: roleSuperadmin?.id,
						},
						{ transaction }
					);
					await superadminAdminmenusOpener.addModules(
						[superadminModule],
						{ transaction }
					);

					if (superadminAdminmenusOpener) {
						await superadminAdminmenusOpener.createAdminMenuLanguage(
							{
								name: "Admin menu",
								url: "superadmin/adminmenu",
								LanguageId: en?.id,
							},
							{ transaction }
						);
						await superadminAdminmenusOpener.createAdminMenuLanguage(
							{
								name: "Admin menu",
								url: "superadmin/adminmenu",
								LanguageId: cs?.id,
							},
							{ transaction }
						);

						let superadminAdminmenus =
							await superadminAdminmenusOpener.createChild(
								{
									name: "superadminAdminmenus",
									component: "AdminSuperadminAdminmenus",
									openable: false,
									order: 0,
									icon: "mdi-menu",
									RoleId: roleSuperadmin?.id,
								},
								{ transaction }
							);
						await superadminAdminmenus.addModules(
							[superadminModule],
							{ transaction }
						);

						await superadminAdminmenus.createAdminMenuLanguage(
							{
								name: "Edit",
								url: "superadmin/adminmenu/edit",
								LanguageId: en?.id,
							},
							{ transaction }
						);
						await superadminAdminmenus.createAdminMenuLanguage(
							{
								name: "Upravit",
								url: "superadmin/adminmenu/upravit",
								LanguageId: cs?.id,
							},
							{ transaction }
						);
					}
				}

				if (articlesModule) {
					let contentOpener = await AdminMenu.create(
						{
							name: "contentOpener",
							openable: true,
							order: 0,
							icon: "mdi-text-box-outline",
							RoleId: roleAdmin?.id,
						},
						{ transaction }
					);
					await contentOpener.addModules([articlesModule], {
						transaction,
					});

					let adminMenuArticle = await articlesModule.createAdminMenu(
						{
							component: "AdminPagesContentArticles",

							name: "articles",
							openable: false,
							icon: "mdi-card-text-outline",
							order: 0,
							RoleId: roleAdmin?.id,
						},
						{ transaction }
					);
					await adminMenuArticle.setParent(contentOpener, {
						transaction,
					});
					await adminMenuArticle.addModules([articlesModule], {
						transaction,
					});

					await contentOpener.createAdminMenuLanguage(
						{
							name: "Obsah webu",
							url: "obsah",
							LanguageId: cs?.id,
						},
						{ transaction }
					);
					await contentOpener.createAdminMenuLanguage(
						{
							name: "Web content",
							url: "content",
							LanguageId: en?.id,
						},
						{ transaction }
					);

					await adminMenuArticle.createAdminMenuLanguage(
						{
							name: "Články",
							url: "obsah/clanky",
							LanguageId: cs?.id,
						},
						{ transaction }
					);
					await adminMenuArticle.createAdminMenuLanguage(
						{
							name: "Articles",
							url: "content/articles",
							LanguageId: en?.id,
						},
						{ transaction }
					);
					if (webInformationModule) {
						let adminMenuWebInformation =
							await webInformationModule.createAdminMenu(
								{
									component:
										"AdminPagesContentWebInformation",

									name: "webInformation",
									openable: false,
									icon: "mdi-card-text-outline",
									order: 0,
									RoleId: roleAdmin?.id,
								},
								{ transaction }
							);
						await contentOpener.addModules([webInformationModule], {
							transaction,
						});
						await adminMenuWebInformation.setParent(contentOpener, {
							transaction,
						});
						await adminMenuWebInformation.createAdminMenuLanguage(
							{
								name: "Informace o webu",
								url: "obsah/informace-o-webu",
								LanguageId: cs?.id,
							},
							{ transaction }
						);
						await adminMenuWebInformation.createAdminMenuLanguage(
							{
								name: "Website information",
								url: "content/website-information",
								LanguageId: en?.id,
							},
							{ transaction }
						);
					}
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
					AdminMenuLanguage.tableName,
					{},
					{ transaction }
				);
				await queryInterface.bulkDelete(
					AdminMenu.tableName,
					{},
					{ transaction }
				);
			} catch (error) {
				console.log(error);
			}
		});
	},
};
