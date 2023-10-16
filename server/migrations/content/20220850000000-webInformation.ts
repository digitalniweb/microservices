import { QueryInterface, DataTypes } from "sequelize";

import WebInformation from "../../models/content/webInformation.js";
import { WebInformation as WebInformationType } from "../../../digitalniweb-types/models/content.js";

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
			return await queryInterface.createTable<WebInformationType>(
				WebInformation.tableName,
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
					value: {
						allowNull: true,
						type: DataTypes.STRING,
					},
					websiteId: {
						allowNull: false,
						type: DataTypes.INTEGER,
					},
					websitesMsId: {
						allowNull: false,
						type: DataTypes.INTEGER,
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
			return await queryInterface.dropTable(WebInformation.tableName, {
				transaction,
			});
		});
	},
};
