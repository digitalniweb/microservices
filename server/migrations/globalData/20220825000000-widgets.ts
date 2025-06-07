import { QueryInterface, DataTypes } from "sequelize";

import Widget from "../../models/globalData/widget.js";
import type { Widget as WidgetType } from "../../../digitalniweb-types/models/globalData.js";

import type { microservices } from "../../../digitalniweb-types/index.js";
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
			return await queryInterface.createTable<WidgetType>(
				Widget.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					name: {
						type: DataTypes.STRING,
						allowNull: false,
						unique: true,
					},
					component: {
						type: DataTypes.STRING,
						allowNull: true,
						unique: true,
					},
					icon: {
						type: DataTypes.STRING,
						allowNull: true,
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
			return await queryInterface.dropTable(Widget.tableName, {
				transaction,
			});
		});
	},
};
