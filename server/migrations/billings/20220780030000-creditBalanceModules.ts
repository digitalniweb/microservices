import { QueryInterface, DataTypes } from "sequelize";

import CreditBalanceModule from "../../models/billings/creditBalanceModule";
import { billings } from "../../../types/models/billings";
import CreditBalanceModuleType = billings.CreditBalanceModule;

import { microservices } from "../../../types";
const microservice: Array<microservices> = ["billings"];

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<CreditBalanceModuleType>(
				CreditBalanceModule.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					CreditBalanceLogId: {
						type: DataTypes.INTEGER,
						allowNull: false,
					},
					moduleId: {
						type: DataTypes.INTEGER,
						allowNull: false,
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
			return await queryInterface.dropTable(CreditBalanceModule.tableName, {
				transaction,
			});
		});
	},
};
