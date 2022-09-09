import { QueryInterface, DataTypes } from "sequelize";

import Role from "./../../models/users/role";

import { users } from "./../../../types/models/users";
import RoleType = users.Role;

import { microservices } from "./../../../types";
const microservice: Array<microservices> = ["users"];

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
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
		});
	},

	down: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(Role.tableName, {
				transaction,
			});
		});
	},
};
