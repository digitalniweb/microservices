import { QueryInterface, DataTypes } from "sequelize";

import ModulesPagesLanguage from "../../models/websites/modulesPagesLanguage.js";
import { websites } from "../../../types/models/websites.js";
import ModulesPagesLanguageType = websites.ModulesPagesLanguage;

import { microservices } from "../../../types/index.d.js";
import Module from "../../models/globalData/module.js";
const microservice: Array<microservices> = ["websites"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
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
					languageId: {
						type: DataTypes.INTEGER,
						allowNull: false,
					},
					moduleId: {
						type: DataTypes.INTEGER,
						allowNull: false,
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
					translations: {
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
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(ModulesPagesLanguage.tableName, {
				transaction,
			});
		});
	},
};
