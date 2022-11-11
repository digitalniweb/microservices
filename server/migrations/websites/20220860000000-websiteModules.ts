import { QueryInterface, DataTypes } from "sequelize";

import { websites } from "../../../types/models/websites";
import WebsiteModuleType = websites.WebsiteModule;

import { microservices } from "../../../types";
import Website from "../../models/websites/website";
import Module from "../../models/websites/module";
import WebsiteModule from "../../models/websites/WebsiteModule";

const microservice: Array<microservices> = ["websites"];

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<WebsiteModuleType>(
				WebsiteModule.tableName,
				{
					WebsiteId: {
						type: DataTypes.INTEGER,
						references: {
							model: Website.tableName,
							key: "id",
						},
					},
					ModuleId: {
						type: DataTypes.INTEGER,
						references: {
							model: Module.tableName,
							key: "id",
						},
					},
					active: {
						allowNull: false,
						type: DataTypes.BOOLEAN,
						defaultValue: true,
					},
					billingDay: {
						allowNull: false,
						type: DataTypes.INTEGER,
						validate: {
							min: 1,
							max: 31,
						},
					},
					createdAt: {
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
			return await queryInterface.dropTable(WebsiteModule.tableName, {
				transaction,
			});
		});
	},
};
