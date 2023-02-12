import { QueryInterface, DataTypes } from "sequelize";

import UserPrivilege from "./../../models/users/userPrivilege.js";
import User from "./../../models/users/user.js";

import { users } from "./../../../digitalniweb-types/models/users.js";
import UserPrivilegeType = users.UserPrivilege;

import { microservices } from "../../../digitalniweb-types/index.js";
const microservice: Array<microservices> = ["users"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<UserPrivilegeType>(
				UserPrivilege.tableName,
				{
					UserId: {
						type: DataTypes.INTEGER,
						references: {
							model: User.tableName,
							key: "id",
						},
					},
					privilegeId: {
						type: DataTypes.INTEGER,
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
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(UserPrivilege.tableName, {
				transaction,
			});
		});
	},
};
