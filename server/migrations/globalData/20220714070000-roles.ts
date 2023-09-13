import { QueryInterface, DataTypes } from "sequelize";

import Role from "../../models/globalData/role.js";
import RoleType from "../../models/globalData/roleType.js";

import { Role as RoleModelType } from "../../../digitalniweb-types/models/globalData.js";

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
			return await queryInterface.createTable<RoleModelType>(
				Role.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					name: {
						type: DataTypes.STRING(63),
						unique: true,
						allowNull: false,
					},
					RoleTypeId: {
						type: DataTypes.INTEGER,
						references: {
							model: RoleType.tableName,
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
			return await queryInterface.dropTable(Role.tableName, {
				transaction,
			});
		});
	},
};
