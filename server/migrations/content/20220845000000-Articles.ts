import { QueryInterface, DataTypes } from "sequelize";

import Article from "../../models/content/article.js";
import { Article as ArticleType } from "../../../digitalniweb-types/models/content.js";

import { microservices } from "../../../digitalniweb-types/index.js";
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
			return await queryInterface.createTable<ArticleType>(
				Article.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					languageId: {
						allowNull: true,
						type: DataTypes.INTEGER,
					},
					name: {
						allowNull: false,
						type: DataTypes.STRING,
					},
					url: {
						allowNull: false,
						type: DataTypes.STRING,
					},
					icon: {
						allowNull: false,
						type: DataTypes.STRING,
					},
					otherUrl: {
						allowNull: false,
						type: DataTypes.STRING,
					},
					active: {
						allowNull: false,
						type: DataTypes.BOOLEAN,
						defaultValue: false,
					},
					freeMenu: {
						allowNull: false,
						type: DataTypes.BOOLEAN,
						defaultValue: false,
					},
					order: {
						allowNull: false,
						type: DataTypes.INTEGER,
					},
					treeLevel: {
						allowNull: false,
						type: DataTypes.INTEGER,
					},
					parentId: {
						allowNull: true,
						type: DataTypes.INTEGER,
					},
					websiteId: {
						allowNull: false,
						type: DataTypes.INTEGER,
					},
					title: {
						allowNull: false,
						type: DataTypes.STRING,
					},
					description: {
						allowNull: false,
						type: DataTypes.STRING,
					},
					image: {
						allowNull: false,
						type: DataTypes.STRING,
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
			return await queryInterface.dropTable(Article.tableName, {
				transaction,
			});
		});
	},
};
