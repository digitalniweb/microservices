import { QueryInterface, DataTypes } from "sequelize";

import { globalData } from "../../../digitalniweb-types/models/globalData";
import AdminMenuType = globalData.AdminMenu;

import { microservices } from "../../../digitalniweb-types/index.js";
import AdminMenu from "../../models/globalData/adminMenu.js";
import App from "../../models/globalData/app.js";
import Language from "../../models/globalData/language";
import Module from "../../models/globalData/module";

const microservice: Array<microservices> = ["globalData"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<AdminMenuType>(
				AdminMenu.tableName,
				{
					id: {
						type: DataTypes.INTEGER,
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
					},
					component: {
						type: DataTypes.STRING,
						allowNull: false,
					},
					name: {
						type: DataTypes.STRING,
						allowNull: false,
					},
					openable: {
						type: DataTypes.BOOLEAN,
						allowNull: false,
						defaultValue: false,
					},
					separator: {
						type: DataTypes.BOOLEAN,
						allowNull: false,
						defaultValue: false,
					},
					isDefault: {
						type: DataTypes.BOOLEAN,
						allowNull: false,
						defaultValue: false,
					},
					order: {
						type: DataTypes.INTEGER,
						allowNull: false,
						defaultValue: false,
					},
					icon: {
						type: DataTypes.BOOLEAN,
						allowNull: false,
						defaultValue: false,
					},
					parentId: {
						type: DataTypes.INTEGER,
						allowNull: true,
						defaultValue: null,
					},
					ModuleId: {
						type: DataTypes.BOOLEAN,
						allowNull: true,
						references: {
							model: Module.tableName,
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
			return console.log("Omitted");
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(AdminMenu.tableName, {
				transaction,
			});
		});
	},
};
