import { QueryInterface, DataTypes } from "sequelize";

import type { AdminMenuLanguage as AdminMenuLanguageType } from "../../../digitalniweb-types/models/globalData";

import type { microservices } from "../../../digitalniweb-types/index";
import AdminMenuLanguage from "../../models/globalData/adminMenuLanguage.js";
import AdminMenu from "../../models/globalData/adminMenu.js";
import Language from "../../models/globalData/language.js";

const microservice: Array<microservices> = ["globalData"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<AdminMenuLanguageType>(
				AdminMenuLanguage.tableName,
				{
					id: {
						type: DataTypes.INTEGER,
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
					},
					name: {
						type: DataTypes.STRING,
						allowNull: false,
					},
					url: {
						type: DataTypes.STRING,
						allowNull: true,
					},
					AdminMenuId: {
						type: DataTypes.INTEGER,
						references: {
							model: AdminMenu.tableName,
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
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(AdminMenuLanguage.tableName, {
				transaction,
			});
		});
	},
};
