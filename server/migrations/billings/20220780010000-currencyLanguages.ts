import { QueryInterface, DataTypes } from "sequelize";

import CurrencyLanguage from "../../models/billings/currencyLanguage";
import { billings } from "../../../types/models/billings";
import CurrencyLanguageType = billings.CurrencyLanguage;

import { microservices } from "../../../types";
import Currency from "../../models/billings/currency";
const microservice: Array<microservices> = ["billings"];

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<CurrencyLanguageType>(
				CurrencyLanguage.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					CurrencyId: {
						type: DataTypes.INTEGER,
						allowNull: false,
						references: {
							model: Currency.tableName,
							key: "id",
						},
					},
					languageId: {
						type: DataTypes.INTEGER,
						allowNull: false,
					},
					name: {
						type: DataTypes.STRING,
						allowNull: false,
						unique: true,
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
			return await queryInterface.dropTable(CurrencyLanguage.tableName, {
				transaction,
			});
		});
	},
};
