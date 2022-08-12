import { QueryInterface, DataTypes } from "sequelize";

import Language from "../models/websites/language";
import { websites } from "../../types/models";
import TenantType = websites.Language;

import { microservices } from "../../types";
const microservice: Array<microservices> = ["websites"];

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<TenantType>(
				Language.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					code: {
						allowNull: false,
						type: DataTypes.STRING(7),
					},
					name: {
						allowNull: false,
						type: DataTypes.STRING(63),
					},
					icon: {
						allowNull: false,
						type: DataTypes.STRING,
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
			return await queryInterface.dropTable(Language.tableName, {
				transaction,
			});
		});
	},
};
