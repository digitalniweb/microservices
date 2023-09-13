import { QueryInterface, DataTypes } from "sequelize";

import Invoice from "../../models/billings/invoice.js";
import { Invoice as InvoiceType } from "../../../digitalniweb-types/models/billings.js";

import { microservices } from "../../../digitalniweb-types/index.js";
import CreditBalanceLog from "../../models/billings/creditBalanceLog.js";
import Currency from "../../models/globalData/currency.js";
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
					currencyId: {
						type: DataTypes.INTEGER,
						allowNull: false,
						references: {
							model: Currency.tableName,
							key: "id",
						},
					},
					statusId: {
						type: DataTypes.INTEGER,
						allowNull: false,
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
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(Invoice.tableName, {
				transaction,
			});
		});
	},
};
