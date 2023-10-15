import { QueryInterface, DataTypes } from "sequelize";

import { WebsiteLanguageMutation as WebsiteLanguageMutationType } from "../../../digitalniweb-types/models/websites.js";

import { microservices } from "../../../digitalniweb-types/index.js";
import Website from "../../models/websites/website.js";
import WebsiteLanguageMutation from "../../models/websites/websiteLanguageMutation.js";

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
			return await queryInterface.createTable<WebsiteLanguageMutationType>(
				WebsiteLanguageMutation.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					WebsiteId: {
						type: DataTypes.INTEGER,
						references: {
							model: Website.tableName,
							key: "id",
						},
					},
					languageId: {
						type: DataTypes.INTEGER,
						allowNull: false,
					},
				},
				{
					charset: "utf8mb4",
					collate: "utf8mb4_unicode_ci",
					transaction,
				}
			);
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
			return await queryInterface.dropTable(
				WebsiteLanguageMutation.tableName,
				{
					transaction,
				}
			);
		});
	},
};
