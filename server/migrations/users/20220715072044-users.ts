import { QueryInterface, DataTypes } from "sequelize";

import User from "./../../models/users/user.js";
import { users } from "./../../../types/models/users.js";
import UserType = users.User;

import { microservices } from "./../../../types/index.d.js";
const microservice: Array<microservices> = ["users"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<UserType>(
				User.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					nickname: {
						type: DataTypes.STRING(255),
						unique: true,
						allowNull: true,
					},
					email: {
						type: DataTypes.STRING,
						allowNull: true,
					},
					password: {
						type: DataTypes.STRING,
						allowNull: false,
					},
					refreshTokenSalt: {
						type: DataTypes.STRING(20),
						allowNull: false,
					},
					roleId: {
						type: DataTypes.INTEGER,
						allowNull: false,
					},
					domainId: {
						type: DataTypes.INTEGER,
					},
					active: {
						type: DataTypes.BOOLEAN,
						allowNull: false,
						defaultValue: true,
					},
					createdAt: {
						allowNull: false,
						type: DataTypes.DATE,
					},
					updatedAt: {
						allowNull: false,
						type: DataTypes.DATE,
					},
					deletedAt: {
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
			return await queryInterface.dropTable(User.tableName, {
				transaction,
			});
		});
	},
};
