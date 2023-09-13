import { QueryInterface, DataTypes } from "sequelize";

import { WebsiteModule as WebsiteModuleType } from "../../../digitalniweb-types/models/websites.js";

import { microservices } from "../../../digitalniweb-types/index.js";
import Website from "../../models/websites/website.js";
import WebsiteModule from "../../models/websites/websiteModule.js";

const microservice: Array<microservices> = ["websites"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<WebsiteModuleType>(
				WebsiteModule.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					WebsiteId: {
						type: DataTypes.INTEGER,
						references: {
							model: Website.tableName,
							key: "id",
						},
					},
					moduleId: {
						type: DataTypes.INTEGER,
						allowNull: false,
					},
					active: {
						allowNull: false,
						type: DataTypes.BOOLEAN,
						defaultValue: true,
					},
					billingDay: {
						allowNull: false,
						type: DataTypes.INTEGER,
						validate: {
							min: 1,
							max: 31,
						},
					},
					createdAt: {
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
			return await queryInterface.dropTable(WebsiteModule.tableName, {
				transaction,
			});
		});
	},
};
