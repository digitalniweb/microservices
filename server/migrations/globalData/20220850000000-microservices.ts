import { QueryInterface, DataTypes } from "sequelize";

import Microservice from "../../models/globalData/microservice.js";
import type { Microservice as MicroserviceType } from "../../../digitalniweb-types/models/globalData.js";

import type { microservices } from "../../../digitalniweb-types/index.js";
import ServiceRegistry from "../../models/globalData/serviceRegistry.js";
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
			return await queryInterface.createTable<MicroserviceType>(
				Microservice.tableName,
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
					mainServiceRegistryId: {
						type: DataTypes.INTEGER,
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
			return await queryInterface.dropTable(Microservice.tableName, {
				transaction,
			});
		});
	},
};
