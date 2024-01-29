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

		/*
		add titlePostfix 

		name, string(128)
		description, string(256), null
		motto, string(256), null
		mainImage, string(256), null
		logo, string(256), null
		favicon, string(256)
		googleTagManager, string(32), null
		googleTagManagerActive, boolean, default 0
		socialMedia, text, null
		languageId, number
		websiteId, number
		websitesMsId, number
		owner, string(128)
		tin, string(16), null
		vatId, string(16), null
		country, string(32), null
		city, string(32), null
		zip, string(16), null
		streetAddress, string(64), null
		landRegistryNumber, string(32), null
		houseNumber, string(8), null
		addressPattern, string(64), null
		fullAddress, string(256), null
		telephone, string(16), null
		email, string(64)
		bankName, string(32), null
		bankAccountNumber, string(32), null
		bankCode, string(32), null
		bankIBAN, string(32), null
		*/
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
					name: { allowNull: false, type: DataTypes.STRING(128) },
					description: {
						allowNull: true,
						type: DataTypes.STRING(256),
					},
					titlePostfix: {
						allowNull: true,
						type: DataTypes.STRING(128),
					},
					motto: { allowNull: true, type: DataTypes.STRING(256) },
					mainImage: { allowNull: true, type: DataTypes.STRING(256) },
					logo: { allowNull: true, type: DataTypes.STRING(256) },
					favicon: { allowNull: false, type: DataTypes.STRING(256) },
					googleTagManager: {
						allowNull: true,
						type: DataTypes.STRING(32),
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
					owner: { allowNull: false, type: DataTypes.STRING(128) },
					tin: { allowNull: true, type: DataTypes.STRING(16) },
					vatId: { allowNull: true, type: DataTypes.STRING(16) },
					country: { allowNull: true, type: DataTypes.STRING(32) },
					city: { allowNull: true, type: DataTypes.STRING(32) },
					zip: { allowNull: true, type: DataTypes.STRING(16) },
					streetAddress: {
						allowNull: true,
						type: DataTypes.STRING(64),
					},
					landRegistryNumber: {
						allowNull: true,
						type: DataTypes.STRING(32),
					},
					houseNumber: { allowNull: true, type: DataTypes.STRING(8) },
					addressPattern: {
						allowNull: true,
						type: DataTypes.STRING(64),
					},
					fullAddress: {
						allowNull: true,
						type: DataTypes.STRING(256),
					},
					telephone: { allowNull: true, type: DataTypes.STRING(16) },
					email: { allowNull: false, type: DataTypes.STRING(64) },
					bankName: { allowNull: true, type: DataTypes.STRING(32) },
					bankAccountNumber: {
						allowNull: true,
						type: DataTypes.STRING(32),
					},
					bankCode: { allowNull: true, type: DataTypes.STRING(32) },
					bankIBAN: { allowNull: true, type: DataTypes.STRING(32) },
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
