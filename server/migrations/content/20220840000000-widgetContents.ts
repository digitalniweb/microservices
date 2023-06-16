import { QueryInterface, DataTypes } from "sequelize";

import WidgetContent from "../../models/content/widgetContent.js";
import { content } from "../../../digitalniweb-types/models/content.js";
import WidgetContentType = content.WidgetContent;

import { microservices } from "../../../digitalniweb-types/index.js";
const microservice: Array<microservices> = ["content"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<WidgetContentType>(
				WidgetContent.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					widgetId: {
						allowNull: false,
						type: DataTypes.INTEGER,
					},
					moduleId: {
						allowNull: false,
						type: DataTypes.INTEGER,
					},
					moduleRecordId: {
						allowNull: false,
						type: DataTypes.INTEGER,
					},
					name: {
						allowNull: false,
						type: DataTypes.STRING,
					},
					content: {
						allowNull: false,
						type: DataTypes.STRING,
					},
					options: {
						allowNull: false,
						type: DataTypes.JSON,
					},
					active: {
						allowNull: false,
						type: DataTypes.BOOLEAN,
						defaultValue: false,
					},
					order: {
						allowNull: false,
						type: DataTypes.INTEGER,
					},
					createdAt: {
						allowNull: false,
						type: DataTypes.DATE,
					},
					updatedAt: {
						allowNull: false,
						type: DataTypes.DATE,
					},
					deletedAt: {
						type: DataTypes.DATE,
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
			return await queryInterface.dropTable(WidgetContent.tableName, {
				transaction,
			});
		});
	},
};
