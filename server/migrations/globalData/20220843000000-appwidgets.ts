import { QueryInterface, DataTypes } from "sequelize";

import AppWidget from "../../models/globalData/appWidget.js";
import { globalData } from "../../../digitalniweb-types/models/globalData.js";
import AppWidgetType = globalData.AppWidget;

import { microservices } from "../../../digitalniweb-types/index.js";
import App from "../../models/globalData/app.js";
import Widget from "../../models/globalData/widget.js";
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
			return await queryInterface.createTable<AppWidgetType>(
				AppWidget.tableName,
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
					WidgetId: {
						type: DataTypes.INTEGER,
						references: {
							model: Widget.tableName,
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
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(AppWidget.tableName, {
				transaction,
			});
		});
	},
};
