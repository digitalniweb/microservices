import { QueryInterface, DataTypes } from "sequelize";

import CreditBalanceCompletionLog from "../../models/billings/creditBalanceCompletionLog";
import { billings } from "../../../types/models/billings";
import CreditBalanceCompletionLogType = billings.CreditBalanceCompletionLog;

import { microservices } from "../../../types";
const microservice: Array<microservices> = ["billings"];

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<CreditBalanceCompletionLogType>(
				CreditBalanceCompletionLog.tableName,
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
					CreditBalanceTypeId: {
						type: DataTypes.INTEGER,
						allowNull: false,
					},
					completed: {
						type: DataTypes.BOOLEAN,
						allowNull: false,
						defaultValue: false,
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
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(
				CreditBalanceCompletionLog.tableName,
				{
					transaction,
				}
			);
		});
	},
};
