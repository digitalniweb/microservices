import { QueryInterface, DataTypes } from "sequelize";

import Currency from "../../models/global/currency.js";
import { global } from "../../../types/models/global.js";
import LanguageType = global.Currency;

import { microservices } from "../../../types/index.js";
const microservice: Array<microservices> = ["global"];

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
