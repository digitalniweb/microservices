import { QueryInterface, DataTypes } from "sequelize";

import Currency from "../../models/invoices/currency";
import { invoices } from "../../../types/models/invoices";
import LanguageType = invoices.Currency;

import { microservices } from "../../../types";
const microservice: Array<microservices> = ["invoices"];

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<LanguageType>(
				Currency.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					code: {
						allowNull: false,
						type: DataTypes.STRING(3),
					},
					sign: {
						allowNull: false,
						type: DataTypes.STRING(4),
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
			return await queryInterface.dropTable(Currency.tableName, {
				transaction,
			});
		});
	},
};
