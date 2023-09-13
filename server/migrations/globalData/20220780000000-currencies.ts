import { QueryInterface, DataTypes } from "sequelize";

import Currency from "../../models/globalData/currency.js";
import { Currency as CurrencyType } from "../../../digitalniweb-types/models/globalData.js";

import { microservices } from "../../../digitalniweb-types/index.js";
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
			return await queryInterface.createTable<CurrencyType>(
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
						unique: true,
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
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(Currency.tableName, {
				transaction,
			});
		});
	},
};
