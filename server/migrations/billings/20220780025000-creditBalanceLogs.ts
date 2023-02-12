import { QueryInterface, DataTypes } from "sequelize";

import CreditBalanceLog from "../../models/billings/creditBalanceLog.js";
import { billings } from "../../../digitalniweb-types/models/billings.js";
import CreditBalanceLogType = billings.CreditBalanceLog;

import { microservices } from "../../../digitalniweb-types/index.js";
import CreditBalanceType from "../../models/billings/creditBalanceType.js";
const microservice: Array<microservices> = ["billings"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<CreditBalanceLogType>(
				CreditBalanceLog.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					appId: {
						type: DataTypes.INTEGER,
						allowNull: false,
					},
					userId: {
						type: DataTypes.INTEGER,
						allowNull: false,
					},
					websiteId: {
						type: DataTypes.INTEGER,
						allowNull: true,
					},
					creditDifference: {
						type: DataTypes.INTEGER,
						allowNull: false,
					},
					CreditBalanceTypeId: {
						type: DataTypes.INTEGER,
						allowNull: false,
						references: {
							model: CreditBalanceType.tableName,
							key: "id",
						},
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
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(CreditBalanceLog.tableName, {
				transaction,
			});
		});
	},
};
