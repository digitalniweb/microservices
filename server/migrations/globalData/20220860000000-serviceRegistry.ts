import { QueryInterface, DataTypes } from "sequelize";

import ServiceRegistry from "../../models/globalData/serviceRegistry.js";
import { ServiceRegistry as ServiceRegistryType } from "../../../digitalniweb-types/models/globalData.js";

import { microservices } from "../../../digitalniweb-types/index.js";
import Microservice from "../../models/globalData/microservice.js";
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
						type: DataTypes.STRING(255),
						allowNull: false,
						unique: "uniqueHostPort",
					},
					port: {
						type: DataTypes.SMALLINT,
						allowNull: false,
						unique: "uniqueHostPort",
					},
					uniqueName: {
						type: DataTypes.STRING(14),
						allowNull: false,
						unique: true,
					},
					MicroserviceId: {
						type: DataTypes.INTEGER,
						references: {
							model: Microservice.tableName,
							key: "id",
						},
						allowNull: false,
					},
					apiKey: {
						type: DataTypes.STRING(64),
						allowNull: false,
						unique: true,
					},
				},
				{
					uniqueKeys: {
						uniqueHostPort: {
							customIndex: true,
							fields: ["host", "port"],
						},
					},
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
			return await queryInterface.dropTable(ServiceRegistry.tableName, {
				transaction,
			});
		});
	},
};
