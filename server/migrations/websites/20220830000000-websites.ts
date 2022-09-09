import { QueryInterface, DataTypes } from "sequelize";

import Website from "../../models/websites/website";
import App from "./../../models/websites/app";
import Language from "./../../models/websites/language";
import { websites } from "../../../types/models/websites";
import WebsiteType = websites.Website;

import { microservices } from "../../../types";
const microservice: Array<microservices> = ["websites"];

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<WebsiteType>(
				Website.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					uniqueName: {
						type: DataTypes.STRING(10),
						allowNull: false,
						unique: true,
					},
					MainUrlId: {
						type: DataTypes.INTEGER,
						// Even though the reference is true, I have reference Website -> Url and Url -> Website, so there is DB conflict. I can't reference something that doesn't exist yet. That's why I use it only in Url migration, because I want to be able to use onDelete Cascade there. I don't need it to be constrained here. The association is made by model, which works fine.
						/* references: {
							model: Url.tableName,
							key: "id",
						}, */
						allowNull: true,
					},
					userId: {
						type: DataTypes.INTEGER,
					},
					AppId: {
						type: DataTypes.INTEGER,
						references: {
							model: App.tableName,
							key: "id",
						},
						allowNull: true,
					},
					MainLanguageId: {
						type: DataTypes.INTEGER,
						references: {
							model: Language.tableName,
							key: "id",
						},
						allowNull: true,
					},
					testingMode: {
						type: DataTypes.BOOLEAN,
						allowNull: false,
						defaultValue: 1,
					},
					paused: {
						type: DataTypes.BOOLEAN,
						allowNull: false,
						defaultValue: 0,
					},
					active: {
						type: DataTypes.BOOLEAN,
						allowNull: false,
						defaultValue: 1,
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
			return await queryInterface.dropTable(Website.tableName, {
				transaction,
			});
		});
	},
};
