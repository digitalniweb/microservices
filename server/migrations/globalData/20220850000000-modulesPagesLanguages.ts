import { QueryInterface, DataTypes } from "sequelize";

import ModulesPagesLanguage from "../../models/globalData/modulesPagesLanguage.js";
import { globalData } from "../../../digitalniweb-types/models/globalData.js";
import ModulesPagesLanguageType = globalData.ModulesPagesLanguage;

import { microservices } from "../../../digitalniweb-types/index.js";
import Module from "../../models/globalData/module.js";
import Language from "../../models/globalData/language.js";
const microservice: Array<microservices> = ["globalData"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<ModulesPagesLanguageType>(
				ModulesPagesLanguage.tableName,
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
					ModuleId: {
						type: DataTypes.INTEGER,
						references: {
							model: Module.tableName,
							key: "id",
						},
					},
					url: {
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
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(
				ModulesPagesLanguage.tableName,
				{
					transaction,
				}
			);
		});
	},
};
