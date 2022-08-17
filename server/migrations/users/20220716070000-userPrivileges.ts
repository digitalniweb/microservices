import { QueryInterface, DataTypes } from "sequelize";

import UserPrivilege from "./../../models/users/userPrivilege";
import Privilege from "./../../models/users/privilege";
import User from "./../../models/users/user";

import { users } from "./../../../types/models";
import UserPrivilegeType = users.UserPrivilege;

import { microservices } from "./../../../types";
const microservice: Array<microservices> = ["users"];

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
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
					PrivilegeId: {
						type: DataTypes.INTEGER,
						references: {
							model: Privilege.tableName,
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
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(UserPrivilege.tableName, {
				transaction,
			});
		});
	},
};
