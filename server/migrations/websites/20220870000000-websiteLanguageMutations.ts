import { QueryInterface, DataTypes } from "sequelize";

import { websites } from "../../../types/models/websites";
import WebsiteLanguageMutationType = websites.WebsiteLanguageMutation;

import { microservices } from "../../../types";
import Website from "../../models/websites/website";
import WebsiteLanguageMutation from "../../models/websites/websiteLanguageMutation";
import Language from "../../models/websites/language";

const microservice: Array<microservices> = ["websites"];

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<WebsiteLanguageMutationType>(
				WebsiteLanguageMutation.tableName,
				{
					WebsiteId: {
						type: DataTypes.INTEGER,
						references: {
							model: Website.tableName,
							key: "id",
						},
					},
					LanguageId: {
						type: DataTypes.INTEGER,
						references: {
							model: Language.tableName,
							key: "id",
						},
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
			return await queryInterface.dropTable(WebsiteLanguageMutation.tableName, {
				transaction,
			});
		});
	},
};
