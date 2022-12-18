import { QueryInterface, DataTypes } from "sequelize";

import ServiceRegistry from "../../models/globalData/serviceRegistry.js";
import { globalData } from "../../../types/models/globalData.js";
import ServiceRegistryType = globalData.ServiceRegistry;

import { microservices } from "../../../types/index.js";
import Microservice from "../../models/globalData/microservice.js";
const microservice: Array<microservices> = ["globalData"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<ServiceRegistryType>(
				ServiceRegistry.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					host: {
						type: DataTypes.STRING,
						allowNull: false,
					},
					port: {
						type: DataTypes.INTEGER,
						allowNull: false,
					},
					MicroserviceId: {
						type: DataTypes.INTEGER,
						references: {
							model: Microservice.tableName,
							key: "id",
						},
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
			return await queryInterface.dropTable(ServiceRegistry.tableName, {
				transaction,
			});
		});
	},
};
