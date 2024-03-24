import { QueryInterface } from "sequelize";

import { microservices } from "../../../digitalniweb-types/index.js";
import AdminMenu from "../../models/globalData/adminMenu.js";
import Module from "../../models/globalData/module.js";
import Language from "../../models/globalData/language.js";
import AdminMenuLanguage from "../../models/globalData/adminMenuLanguage.js";
import Role from "../../models/globalData/role.js";
const microservice: Array<microservices> = ["globalData"];

/* 
npm run buildSequelize
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

				let articles = await Module.findOne({
					where: {
						name: "Articles",
					},
					transaction,
				});

				let contentOpener = await AdminMenu.create(
					{
						isDefault: true,
						name: "contentOpener",
						openable: true,
						order: 0,
						icon: "mdi-text-box-outline",
						separator: true,
						RoleId: roleAdmin?.id,
					},
					{ transaction }
				);

				let superadminSeparator = await AdminMenu.create(
					{
						isDefault: false,
						name: "superadminSeparator",
						openable: true,
						order: 100,
						icon: "mdi-shield-account-outline",
						separator: true,
						RoleId: roleSuperadmin?.id,
					},
					{ transaction }
				);

				let superadminModulesOpener = await AdminMenu.create(
					{
						isDefault: false,
						name: "superadminModulesOpener",
						openable: true,
						order: 101,
						icon: "mdi-view-dashboard-outline",
						separator: true,
						RoleId: roleSuperadmin?.id,
					},
					{ transaction }
				);

				if (superadminSeparator)
					await superadminSeparator.createAdminMenuLanguage(
						{
							name: "Superadmin",
							LanguageId: en?.id,
						},
						{ transaction }
					);

				if (superadminModulesOpener) {
					let superadminAppModules =
						await superadminModulesOpener.createChild(
							{
								isDefault: false,
								name: "superadminAppModules",
								component: "AdminSuperadminAppModules",
								openable: false,
								order: 0,
								icon: "mdi-view-dashboard-edit-outline",
								RoleId: roleSuperadmin?.id,
							},
							{ transaction }
						);

					await superadminModulesOpener.createAdminMenuLanguage(
						{
							name: "Modules",
							LanguageId: en?.id,
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
				}

				let superadminLanguagesOpener = await AdminMenu.create(
					{
						isDefault: false,
						name: "superadminLanguagesOpener",
						openable: true,
						order: 102,
						icon: "mdi-account-voice",
						separator: true,
						RoleId: roleSuperadmin?.id,
					},
					{ transaction }
				);
				if (superadminLanguagesOpener) {
					let superadminAppLanguages =
						await superadminModulesOpener.createChild(
							{
								isDefault: false,
								name: "superadminAppLanguages",
								component: "AdminSuperadminAppLanguages",
								openable: false,
								order: 0,
								icon: "mdi-account-voice",
								RoleId: roleSuperadmin?.id,
							},
							{ transaction }
						);

					await superadminLanguagesOpener.createAdminMenuLanguage(
						{
							name: "Languages",
							LanguageId: en?.id,
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
				}

				if (articles) {
					let adminMenuArticle = await articles.createAdminMenu(
						{
							component: "AdminPagesArticles",
							isDefault: true,
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

					await contentOpener.createAdminMenuLanguage(
						{
							name: "Obsah webu",
							LanguageId: cs?.id,
						},
						{ transaction }
					);
					await contentOpener.createAdminMenuLanguage(
						{
							name: "Web content",
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
				}

				let superadminWidgetsOpener = await AdminMenu.create(
					{
						isDefault: false,
						name: "superadminWidgetsOpener",
						openable: true,
						order: 103,
						icon: "mdi-dots-grid",
						separator: true,
						RoleId: roleSuperadmin?.id,
					},
					{ transaction }
				);

				if (superadminWidgetsOpener) {
					let superadminAppWidgets =
						await superadminWidgetsOpener.createChild(
							{
								isDefault: false,
								name: "superadminAppWidgets",
								component: "AdminSuperadminAppWidgets",
								openable: false,
								order: 0,
								icon: "mdi-dots-grid",
								RoleId: roleSuperadmin?.id,
							},
							{ transaction }
						);

					await superadminWidgetsOpener.createAdminMenuLanguage(
						{
							name: "Widgets",
							LanguageId: en?.id,
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
				}

				let superadminAdminmenusOpener = await AdminMenu.create(
					{
						isDefault: false,
						name: "superadminAdminmenusOpener",
						openable: true,
						order: 104,
						icon: "mdi-menu",
						separator: true,
						RoleId: roleSuperadmin?.id,
					},
					{ transaction }
				);

				if (superadminAdminmenusOpener) {
					let superadminAppAdminmenus =
						await superadminAdminmenusOpener.createChild(
							{
								isDefault: false,
								name: "superadminAppAdminmenus",
								component: "AdminSuperadminAppAdminmenus",
								openable: false,
								order: 0,
								icon: "mdi-menu",
								RoleId: roleSuperadmin?.id,
							},
							{ transaction }
						);

					await superadminAdminmenusOpener.createAdminMenuLanguage(
						{
							name: "Admin menu",
							LanguageId: en?.id,
						},
						{ transaction }
					);
					await superadminAppAdminmenus.createAdminMenuLanguage(
						{
							name: "App admin menu",
							url: "superadmin/adminmenus/appadminmenus",
							LanguageId: en?.id,
						},
						{ transaction }
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
