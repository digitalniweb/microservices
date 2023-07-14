import { QueryInterface, DataTypes } from "sequelize";

import LoginLog from "./../../models/users/loginLog.js";
import User from "./../../models/users/user.js";
import { LoginLog as LoginLogType } from "./../../../digitalniweb-types/models/users.js";

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
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(LoginLog.tableName, {
				transaction,
			});
		});
	},
};
