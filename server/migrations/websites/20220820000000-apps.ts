import { QueryInterface, DataTypes } from "sequelize";

import App from "./../../models/websites/app.js";
import { websites } from "./../../../digitalniweb-types/models/websites.js";
import AppTsType = websites.App;

import { microservices } from "../../../digitalniweb-types/index.js";
const microservice: Array<microservices> = ["websites"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		console.log(App);

		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<AppTsType>(
				App.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					parentId: {
						type: DataTypes.INTEGER,
					},
					name: {
						type: DataTypes.STRING(255),
						allowNull: false,
						unique: true,
					},
					appTypeId: {
						type: DataTypes.INTEGER,
						allowNull: false,
					},
					host: {
						type: DataTypes.STRING(255),
						allowNull: false,
						unique: "uniqueHostPort",
					},
					port: {
						type: DataTypes.SMALLINT.UNSIGNED,
						allowNull: false,
						unique: "uniqueHostPort",
					},
					uniqueName: {
						type: DataTypes.STRING(10),
						allowNull: false,
						unique: true,
					},
					apiKey: {
						type: DataTypes.STRING(64),
						allowNull: false,
						unique: true,
					},
				},
				{
					uniqueKeys: {
						uniqueHostPort: {
							customIndex: true,
							fields: ["host", "port"],
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
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(App.tableName, {
				transaction,
			});
		});
	},
};
