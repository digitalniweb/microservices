import { QueryInterface, DataTypes } from "sequelize";

import Role from "../models/role";

import { users } from "../../types/models";
import RoleType = users.Role;

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> =>
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<RoleType>(
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
					type: {
						type: DataTypes.STRING(63),
						allowNull: true,
					},
				},
				{
					charset: "utf8mb4",
					collate: "utf8mb4_unicode_ci",
					transaction,
				}
			);
		}),

	down: (queryInterface: QueryInterface): Promise<void> =>
		queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(Role.tableName, {
				transaction,
			});
		}),
};
