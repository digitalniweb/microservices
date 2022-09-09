import { QueryInterface, DataTypes } from "sequelize";

import LoginLog from "./../../models/users/LoginLog";
import User from "./../../models/users/user";
import { users } from "./../../../types/models/users";
import LoginLogType = users.LoginLog;

import { microservices } from "./../../../types";
const microservice: Array<microservices> = ["users"];

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<LoginLogType>(
				LoginLog.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					userLogin: {
						type: DataTypes.STRING,
						allowNull: false,
					},
					UserId: {
						type: DataTypes.INTEGER,
						references: {
							model: User.tableName,
							key: "id",
						},
						allowNull: false,
					},
					ip: {
						type: DataTypes.STRING,
					},
					userAgent: {
						type: DataTypes.JSON,
					},
					successful: {
						type: DataTypes.BOOLEAN,
						allowNull: false,
					},
					createdAt: {
						allowNull: false,
						type: DataTypes.DATE,
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
			return await queryInterface.dropTable(LoginLog.tableName, {
				transaction,
			});
		});
	},
};
