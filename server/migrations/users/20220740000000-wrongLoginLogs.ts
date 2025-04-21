import { QueryInterface, DataTypes } from "sequelize";

import WrongLoginLog from "../../models/users/wrongLoginLog.js";
import type { WrongLoginLog as WrongLoginLogType } from "../../../digitalniweb-types/models/users.js";

import type { microservices } from "../../../digitalniweb-types/index.js";
const microservice: Array<microservices> = ["users"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<WrongLoginLogType>(
				WrongLoginLog.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					userLogin: {
						type: DataTypes.STRING,
					},
					websiteId: {
						type: DataTypes.INTEGER,
						allowNull: false,
					},
					websitesMsId: {
						type: DataTypes.INTEGER,
						allowNull: false,
					},
					ip: {
						type: DataTypes.STRING,
					},
					unsuccessfulCount: {
						type: DataTypes.INTEGER.UNSIGNED,
						allowNull: false,
						defaultValue: 1,
					},
					createdAt: {
						allowNull: false,
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
			return await queryInterface.dropTable(WrongLoginLog.tableName, {
				transaction,
			});
		});
	},
};
