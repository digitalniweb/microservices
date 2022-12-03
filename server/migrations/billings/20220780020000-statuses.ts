import { QueryInterface, DataTypes } from "sequelize";

import Status from "../../models/billings/status.js";
import { billings } from "../../../types/models/billings.js";
import StatusType = billings.Status;

import { microservices } from "../../../types/index.d.js";
const microservice: Array<microservices> = ["billings"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<StatusType>(
				Status.tableName,
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
			return await queryInterface.dropTable(Status.tableName, {
				transaction,
			});
		});
	},
};
