import { QueryInterface, DataTypes } from "sequelize";

import CreditBalanceType from "../../models/billings/creditBalanceType.js";
import type { CreditBalanceType as CreditBalanceTypeType } from "../../../digitalniweb-types/models/billings.js";

import type { microservices } from "../../../digitalniweb-types/index.js";
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
			return await queryInterface.createTable<CreditBalanceTypeType>(
				CreditBalanceType.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					name: {
						type: DataTypes.STRING,
						allowNull: false,
						unique: true,
					},
					description: {
						type: DataTypes.STRING,
						allowNull: true,
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
			return await queryInterface.dropTable(CreditBalanceType.tableName, {
				transaction,
			});
		});
	},
};
