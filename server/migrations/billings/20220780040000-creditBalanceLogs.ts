import { QueryInterface, DataTypes } from "sequelize";

import CreditBalanceLog from "../../models/billings/creditBalanceLog";
import { billings } from "../../../types/models/billings";
import CreditBalanceLogType = billings.CreditBalanceLog;

import { microservices } from "../../../types";
const microservice: Array<microservices> = ["billings"];

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
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
			return await queryInterface.dropTable(CreditBalanceLog.tableName, {
				transaction,
			});
		});
	},
};
