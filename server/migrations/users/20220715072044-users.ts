import { QueryInterface, DataTypes } from "sequelize";

import User from "./../../models/users/user.js";
import type { User as UserType } from "./../../../digitalniweb-types/models/users.js";

import type { microservices } from "../../../digitalniweb-types/index.js";
const microservice: Array<microservices> = ["users"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return;
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
					uuid: {
						type: DataTypes.UUID,
						// defaultValue: DataTypes.UUIDV4, // this doesn't work in MariaDB, hooks on model are used instead
						allowNull: false,
					},
					credit: {
						type: DataTypes.INTEGER,
						allowNull: true,
						defaultValue: null,
					},
					nickname: {
						type: DataTypes.STRING(255),
						allowNull: false,
						defaultValue: "",
						unique: "uniqueUserWebsite",
					},
					email: {
						type: DataTypes.STRING,
						allowNull: true,
						unique: "uniqueUserWebsite",
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
					websiteId: {
						type: DataTypes.INTEGER,
						unique: "uniqueUserWebsite",
					},
					websitesMsId: {
						type: DataTypes.INTEGER,
						unique: "uniqueUserWebsite",
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
					uniqueKeys: {
						uniqueUserWebsite: {
							customIndex: true,
							fields: [
								"email",
								"nickname",
								"websiteId",
								"websitesMsId",
							],
						},
					},
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
			return await queryInterface.dropTable(User.tableName, {
				transaction,
			});
		});
	},
};
