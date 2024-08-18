import { QueryInterface, DataTypes } from "sequelize";

import ModulePage from "../../models/globalData/modulePage.js";
import { ModulePage as ModulePageType } from "../../../digitalniweb-types/models/globalData.js";

import { microservices } from "../../../digitalniweb-types/index.js";
import Module from "../../models/globalData/module.js";
// import Role from "../../models/globalData/role.js";
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
			return await queryInterface.createTable<ModulePageType>(
				ModulePage.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					ModuleId: {
						type: DataTypes.INTEGER,
						onDelete: "CASCADE",
						references: {
							model: Module.tableName,
							key: "id",
						},
					},
					name: {
						type: DataTypes.STRING,
						allowNull: false,
						unique: true,
					},
					url: {
						type: DataTypes.STRING,
						allowNull: false,
						unique: true,
					},
					component: {
						type: DataTypes.STRING,
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
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(ModulePage.tableName, {
				transaction,
			});
		});
	},
};
