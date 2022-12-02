import { QueryInterface, DataTypes } from "sequelize";

import AppType from "./../../models/websites/appType.js";
import App from "./../../models/websites/app.js";
import { websites } from "./../../../types/models/websites.js";
import AppTsType = websites.App;

import { microservices } from "./../../../types/index.d.js";
const microservice: Array<microservices> = ["websites"];

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
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
					port: {
						type: DataTypes.SMALLINT.UNSIGNED,
					},
					AppTypeId: {
						type: DataTypes.INTEGER,
						references: {
							model: AppType.tableName,
							key: "id",
						},
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
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(App.tableName, {
				transaction,
			});
		});
	},
};
