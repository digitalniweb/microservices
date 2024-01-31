import { QueryInterface, DataTypes } from "sequelize";

import WebInformation from "../../models/content/webInformation.js";
import { WebInformation as WebInformationType } from "../../../digitalniweb-types/models/content.js";

import { microservices } from "../../../digitalniweb-types/index.js";
const microservice: Array<microservices> = ["content"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return;

		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<WebInformationType>(
				WebInformation.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					name: { allowNull: false, type: DataTypes.STRING(127) },
					description: {
						allowNull: true,
						type: DataTypes.STRING(255),
					},
					titlePostfix: {
						allowNull: true,
						type: DataTypes.STRING(127),
					},
					motto: { allowNull: true, type: DataTypes.STRING(255) },
					mainImage: { allowNull: true, type: DataTypes.STRING(255) },
					logo: { allowNull: true, type: DataTypes.STRING(255) },
					favicon: { allowNull: false, type: DataTypes.STRING(255) },
					googleTagManager: {
						allowNull: true,
						type: DataTypes.STRING(31),
					},
					googleTagManagerActive: {
						allowNull: false,
						defaultValue: 0,
						type: DataTypes.BOOLEAN,
					},
					socialMedia: { allowNull: true, type: DataTypes.TEXT },
					languageId: { allowNull: false, type: DataTypes.INTEGER },
					websiteId: { allowNull: false, type: DataTypes.INTEGER },
					websitesMsId: { allowNull: false, type: DataTypes.INTEGER },
					owner: { allowNull: false, type: DataTypes.STRING(127) },
					tin: { allowNull: true, type: DataTypes.STRING(15) },
					vatId: { allowNull: true, type: DataTypes.STRING(15) },
					country: { allowNull: true, type: DataTypes.STRING(31) },
					city: { allowNull: true, type: DataTypes.STRING(31) },
					zip: { allowNull: true, type: DataTypes.STRING(15) },
					streetAddress: {
						allowNull: true,
						type: DataTypes.STRING(63),
					},
					landRegistryNumber: {
						allowNull: true,
						type: DataTypes.STRING(31),
					},
					houseNumber: { allowNull: true, type: DataTypes.STRING(7) },
					addressPattern: {
						allowNull: true,
						type: DataTypes.STRING(63),
					},
					fullAddress: {
						allowNull: true,
						type: DataTypes.STRING(255),
					},
					telephone: { allowNull: true, type: DataTypes.STRING(15) },
					email: { allowNull: false, type: DataTypes.STRING(63) },
					bankName: { allowNull: true, type: DataTypes.STRING(31) },
					bankAccountNumber: {
						allowNull: true,
						type: DataTypes.STRING(31),
					},
					bankCode: { allowNull: true, type: DataTypes.STRING(31) },
					bankIBAN: { allowNull: true, type: DataTypes.STRING(31) },
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
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(WebInformation.tableName, {
				transaction,
			});
		});
	},
};
