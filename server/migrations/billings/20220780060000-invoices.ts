import { QueryInterface, DataTypes } from "sequelize";

import Invoice from "../../models/billings/invoice";
import { billings } from "../../../types/models/billings";
import InvoiceType = billings.Invoice;

import { microservices } from "../../../types";
import CreditBalanceLog from "../../models/billings/creditBalanceLog";
import Status from "../../models/billings/status";
import Currency from "../../models/billings/currency";
const microservice: Array<microservices> = ["billings"];

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<InvoiceType>(
				Invoice.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					invoiceNumber: {
						type: DataTypes.STRING,
						allowNull: false,
						unique: true,
					},
					amount: {
						type: DataTypes.INTEGER,
						allowNull: false,
					},
					CurrencyId: {
						type: DataTypes.INTEGER,
						allowNull: false,
						references: {
							model: Currency.tableName,
							key: "id",
						},
					},
					StatusId: {
						type: DataTypes.INTEGER,
						allowNull: false,
						references: {
							model: Status.tableName,
							key: "id",
						},
					},
					CreditBalanceLogId: {
						type: DataTypes.INTEGER,
						allowNull: false,
						references: {
							model: CreditBalanceLog.tableName,
							key: "id",
						},
					},
					dueDate: {
						type: DataTypes.DATE,
						allowNull: false,
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
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(Invoice.tableName, {
				transaction,
			});
		});
	},
};
