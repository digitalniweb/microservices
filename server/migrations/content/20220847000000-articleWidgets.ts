import { QueryInterface, DataTypes } from "sequelize";

import ArticleWidget from "../../models/content/articleWidget.js";
import type { ArticleWidget as ArticleWidgetType } from "../../../digitalniweb-types/models/content.js";

import type { microservices } from "../../../digitalniweb-types/index.js";
import Article from "../../models/content/article.js";
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
			return await queryInterface.createTable<ArticleWidgetType>(
				ArticleWidget.tableName,
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
					widgetRowId: {
						allowNull: false,
						type: DataTypes.INTEGER,
					},
					ArticleId: {
						allowNull: false,
						type: DataTypes.INTEGER,
						references: {
							model: Article.tableName,
							key: "id",
						},
					},
					order: {
						type: DataTypes.INTEGER,
						defaultValue: 0,
					},
					active: {
						allowNull: false,
						type: DataTypes.BOOLEAN,
						defaultValue: false,
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
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(ArticleWidget.tableName, {
				transaction,
			});
		});
	},
};
