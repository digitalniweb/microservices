import { QueryInterface, DataTypes } from "sequelize";

import Module from "../../models/globalData/module.js";
import { globalData } from "../../../types/models/globalData.js";
import ModuleType = globalData.Module;

import { microservices } from "../../../types/index.js";
const microservice: Array<microservices> = ["globalData"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<ModuleType>(
				Module.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					active: {
						type: DataTypes.BOOLEAN,
						allowNull: false,
						defaultValue: 1,
					},
					name: {
						type: DataTypes.STRING,
						allowNull: false,
						unique: true,
					},
					dedicatedTable: {
						type: DataTypes.BOOLEAN,
						allowNull: false,
						defaultValue: 0,
					},
					usersRoleId: {
						type: DataTypes.INTEGER,
						allowNull: true,
					},
					creditsCost: {
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
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(Module.tableName, {
				transaction,
			});
		});
	},
};
