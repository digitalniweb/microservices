import { QueryInterface, DataTypes } from "sequelize";

import { websites } from "../../../types/models/websites.js";
import AppLanguageType = websites.AppLanguage;

import { microservices } from "../../../types/index.d.js";
import AppLanguage from "../../models/websites/appLanguage.js";
import App from "../../models/websites/app.js";

const microservice: Array<microservices> = ["websites"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<AppLanguageType>(
				AppLanguage.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					AppId: {
						type: DataTypes.INTEGER,
						references: {
							model: App.tableName,
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
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(AppLanguage.tableName, {
				transaction,
			});
		});
	},
};
