import { QueryInterface, DataTypes } from "sequelize";

import { ModuleWidget as ModuleWidgetType } from "../../../digitalniweb-types/models/globalData";

import { microservices } from "../../../digitalniweb-types/index";
import ModuleWidget from "../../models/globalData/moduleWidget";
import Widget from "../../models/globalData/widget";
import Module from "../../models/globalData/module";

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
			return await queryInterface.createTable<ModuleWidgetType>(
				ModuleWidget.tableName,
				{
					id: {
						type: DataTypes.INTEGER,
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
					},
					WidgetId: {
						type: DataTypes.INTEGER,
						references: {
							model: Widget.tableName,
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
			return await queryInterface.dropTable(ModuleWidget.tableName, {
				transaction,
			});
		});
	},
};
