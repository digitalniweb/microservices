import { QueryInterface, DataTypes } from "sequelize";

import WebInformationLanguage from "../../models/content/webInformationLanguage.js";
import { WebInformationLanguage as WebInformationLanguageType } from "../../../digitalniweb-types/models/content.js";

import { microservices } from "../../../digitalniweb-types/index.js";
import WebInformation from "../../models/content/webInformation.js";
const microservice: Array<microservices> = ["content"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return;

		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<WebInformationLanguageType>(
				WebInformationLanguage.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					name: { allowNull: true, type: DataTypes.STRING(127) },
					description: {
						allowNull: true,
						type: DataTypes.STRING(255),
					},
					titlePostfix: {
						allowNull: true,
						type: DataTypes.STRING(127),
					},
					motto: { allowNull: true, type: DataTypes.STRING(255) },
					mainImage: { allowNull: true, type: DataTypes.STRING(255) },
					logo: { allowNull: true, type: DataTypes.STRING(255) },
					socialMedia: { allowNull: true, type: DataTypes.TEXT },
					languageId: { allowNull: false, type: DataTypes.INTEGER },
					WebInformationId: {
						allowNull: false,
						type: DataTypes.INTEGER,
						references: {
							model: WebInformation.tableName,
							key: "id",
						},
					},
					createdAt: {
						allowNull: false,
						type: DataTypes.DATE,
					},
					updatedAt: {
						allowNull: false,
						type: DataTypes.DATE,
					},
					deletedAt: {
						type: DataTypes.DATE,
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
				WebInformationLanguage.tableName,
				{
					transaction,
				}
			);
		});
	},
};
