import { QueryInterface, DataTypes } from "sequelize";

import Currency from "../../models/billings/currency.js";
import { billings } from "../../../types/models/billings.js";
import LanguageType = billings.Currency;

import { microservices } from "../../../types/index.d.js";
const microservice: Array<microservices> = ["billings"];

export default {
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