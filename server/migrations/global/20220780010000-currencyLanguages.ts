import { QueryInterface, DataTypes } from "sequelize";

import CurrencyLanguage from "../../models/global/currencyLanguage.js";
import { global } from "../../../types/models/global.js";
import CurrencyLanguageType = global.CurrencyLanguage;

import { microservices } from "../../../types/index.js";
import Currency from "../../models/global/currency.js";
import Language from "../../models/global/language.js";
const microservice: Array<microservices> = ["global"];

export default {
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
						references: {
							model: Currency.tableName,
							key: "id",
						},
					},
					LanguageId: {
						type: DataTypes.INTEGER,
						references: {
							model: Language.tableName,
							key: "id",
						},
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
