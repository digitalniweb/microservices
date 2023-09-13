import { QueryInterface, DataTypes } from "sequelize";

import CreditBalanceCompletionLog from "../../models/billings/creditBalanceCompletionLog.js";
import { CreditBalanceCompletionLog as CreditBalanceCompletionLogType } from "../../../digitalniweb-types/models/billings.js";

import { microservices } from "../../../digitalniweb-types/index.js";
const microservice: Array<microservices> = ["billings"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return;
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
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return;
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
