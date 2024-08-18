import { QueryInterface, DataTypes } from "sequelize";

import ModulePageLanguage from "../../models/globalData/modulePageLanguage.js";
import { ModulePageLanguage as ModulePageLanguageType } from "../../../digitalniweb-types/models/globalData.js";

import { microservices } from "../../../digitalniweb-types/index.js";
import Language from "../../models/globalData/language.js";
import ModulePage from "../../models/globalData/modulePage.js";
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
			return await queryInterface.createTable<ModulePageLanguageType>(
				ModulePageLanguage.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					LanguageId: {
						type: DataTypes.INTEGER,
						references: {
							model: Language.tableName,
							key: "id",
						},
					},
					ModulePageId: {
						type: DataTypes.INTEGER,
						onDelete: "CASCADE",
						references: {
							model: ModulePage.tableName,
							key: "id",
						},
					},
					url: {
						type: DataTypes.STRING,
						allowNull: true,
					},
					name: {
						type: DataTypes.STRING,
						allowNull: false,
					},
					title: {
						type: DataTypes.STRING,
						allowNull: true,
					},
					description: {
						type: DataTypes.STRING,
						allowNull: true,
					},
					headline: {
						type: DataTypes.STRING,
						allowNull: true,
					},
					image: {
						type: DataTypes.STRING,
						allowNull: true,
					},
					content: {
						type: DataTypes.TEXT,
					},
					options: {
						type: DataTypes.TEXT,
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
				ModulePageLanguage.tableName,
				{
					transaction,
				}
			);
		});
	},
};
