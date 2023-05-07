import { QueryInterface, DataTypes } from "sequelize";

import App from "../../models/globalData/app.js";
import { globalData } from "../../../digitalniweb-types/models/globalData";
import AppTsType = globalData.App;

import { microservices } from "../../../digitalniweb-types/index.js";
import AppType from "../../models/globalData/appType.js";
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
			return await queryInterface.createTable<AppTsType>(
				App.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					parentId: {
						type: DataTypes.INTEGER,
					},
					name: {
						type: DataTypes.STRING(255),
						allowNull: false,
						unique: true,
					},
					AppTypeId: {
						type: DataTypes.INTEGER,
						allowNull: false,
						references: {
							model: AppType.tableName,
							key: "id",
						},
					},
					port: {
						type: DataTypes.SMALLINT.UNSIGNED,
						allowNull: false,
						unique: false,
					},
					uniqueName: {
						type: DataTypes.STRING(10),
						allowNull: false,
						unique: true,
					},
					apiKey: {
						type: DataTypes.STRING(64),
						allowNull: false,
						unique: true,
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
					/* uniqueKeys: {
						uniqueHostPort: {
							customIndex: true,
							fields: ["host", "port"],
						},
					}, */
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
			return await queryInterface.dropTable(App.tableName, {
				transaction,
			});
		});
	},
};
