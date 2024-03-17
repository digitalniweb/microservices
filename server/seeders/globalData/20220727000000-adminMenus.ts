import { QueryInterface } from "sequelize";

import { microservices } from "../../../digitalniweb-types/index.js";
import AdminMenu from "../../models/globalData/adminMenu.js";
import Module from "../../models/globalData/module.js";
import Language from "../../models/globalData/language.js";
import AdminMenuLanguage from "../../models/globalData/adminMenuLanguage.js";
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
				let contentSeparatorAM = await AdminMenu.create({
					isDefault: true,
					name: "contentSeparator",
					openable: true,
					order: 0,
					icon: "mdi-text-box-outline",
					separator: true,
				});

				if (articles) {
					let adminMenuArticle = await articles.createAdminMenu(
						{
							component: "AdminPagesArticles",
							isDefault: true,
							name: "articles",
							openable: false,
							icon: "mdi-card-text-outline",
							order: 0,
						},
						{ transaction }
					);
					adminMenuArticle.setParent(contentSeparatorAM);

					await adminMenuArticle.createAdminMenuLanguage(
						{
							name: "Články",
							url: "clanky",
							LanguageId: cs?.id,
						},
						{ transaction }
					);
					await adminMenuArticle.createAdminMenuLanguage(
						{
							name: "Articles",
							url: "articles",
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
