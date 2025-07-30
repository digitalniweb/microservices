import { QueryInterface, DataTypes } from "sequelize";

import WidgetText from "../../models/content/widgetText.js";
import type { WidgetText as WidgetTextType } from "../../../digitalniweb-types/models/content.js";

import type { microservices } from "../../../digitalniweb-types/index.js";
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
			return await queryInterface.createTable<WidgetTextType>(
				WidgetText.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					name: {
						allowNull: false,
						type: DataTypes.STRING,
					},
					moduleId: {
						allowNull: false,
						type: DataTypes.INTEGER,
					},
					content: {
						allowNull: false,
						type: DataTypes.STRING,
					},
					options: {
						allowNull: true,
						type: DataTypes.STRING,
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
			return await queryInterface.dropTable(WidgetText.tableName, {
				transaction,
			});
		});
	},
};
