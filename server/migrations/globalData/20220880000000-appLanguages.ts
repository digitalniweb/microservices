import { QueryInterface, DataTypes } from "sequelize";

import { globalData } from "../../../digitalniweb-types/models/globalData";
import AppLanguageType = globalData.AppLanguage;

import { microservices } from "../../../digitalniweb-types/index.js";
import AppLanguage from "../../models/globalData/appLanguage.js";
import App from "../../models/globalData/app.js";
import Language from "../../models/globalData/language";

const microservice: Array<microservices> = ["globalData"];

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
					LanguageId: {
						type: DataTypes.INTEGER,
						allowNull: false,
						references: {
							model: Language.tableName,
							key: "id",
						},
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