import { QueryInterface, DataTypes } from "sequelize";

import type { AdminMenuModule as AdminMenuModuleType } from "../../../digitalniweb-types/models/globalData";

import type { microservices } from "../../../digitalniweb-types/index";
import AdminMenuModule from "../../models/globalData/adminMenuModule";
import AdminMenu from "../../models/globalData/adminMenu";
import Module from "../../models/globalData/module";

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
			return await queryInterface.createTable<AdminMenuModuleType>(
				AdminMenuModule.tableName,
				{
					id: {
						type: DataTypes.INTEGER,
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
					},
					AdminMenuId: {
						type: DataTypes.INTEGER,
						references: {
							model: AdminMenu.tableName,
							key: "id",
						},
					},
					ModuleId: {
						type: DataTypes.INTEGER,
						references: {
							model: Module.tableName,
							key: "id",
						},
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
			return await queryInterface.dropTable(AdminMenuModule.tableName, {
				transaction,
			});
		});
	},
};
