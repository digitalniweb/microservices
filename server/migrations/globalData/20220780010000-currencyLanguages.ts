import { QueryInterface, DataTypes } from "sequelize";

import CurrencyLanguage from "../../models/globalData/currencyLanguage.js";
import type { CurrencyLanguage as CurrencyLanguageType } from "../../../digitalniweb-types/models/globalData.js";

import type { microservices } from "../../../digitalniweb-types/index.js";
import Currency from "../../models/globalData/currency.js";
import Language from "../../models/globalData/language.js";
const microservice: Array<microservices> = ["globalData"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return;
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
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(CurrencyLanguage.tableName, {
				transaction,
			});
		});
	},
};
