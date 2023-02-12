import { QueryInterface, DataTypes } from "sequelize";

import Url from "../../models/websites/url.js";
import Website from "../../models/websites/website.js";
import { websites } from "../../../digitalniweb-types/models/websites.js";
import UrlType = websites.Url;

import { microservices } from "../../../digitalniweb-types/index.js";
const microservice: Array<microservices> = ["websites"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<UrlType>(
				Url.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					url: {
						type: DataTypes.STRING(255),
						allowNull: false,
						unique: true,
					},
					WebsiteId: {
						type: DataTypes.INTEGER,
						references: {
							model: Website.tableName,
							key: "id",
						},
						onDelete: "CASCADE",
						allowNull: true,
						defaultValue: null,
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
			return await queryInterface.dropTable(Url.tableName, {
				transaction,
			});
		});
	},
};
