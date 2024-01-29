"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { WebInformation } from "../../../digitalniweb-types/models/content.js";

const WebInformation = db.define<WebInformation>(
	"WebInformation",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: { type: DataTypes.STRING },
		description: { type: DataTypes.STRING, allowNull: true },
		titlePostfix: { type: DataTypes.STRING, allowNull: true },
		motto: { type: DataTypes.STRING, allowNull: true },
		mainImage: { type: DataTypes.STRING, allowNull: true },
		logo: { type: DataTypes.STRING, allowNull: true },
		favicon: { type: DataTypes.STRING },
		googleTagManager: { type: DataTypes.STRING, allowNull: true },
		googleTagManagerActive: {
			type: DataTypes.BOOLEAN,
			defaultValue: 0,
		},
		socialMedia: { type: DataTypes.TEXT, allowNull: true },
		languageId: { type: DataTypes.INTEGER },
		websiteId: { type: DataTypes.INTEGER },
		websitesMsId: { type: DataTypes.INTEGER },
		owner: { type: DataTypes.STRING },
		tin: { type: DataTypes.STRING, allowNull: true },
		vatId: { type: DataTypes.STRING, allowNull: true },
		country: { type: DataTypes.STRING, allowNull: true },
		city: { type: DataTypes.STRING, allowNull: true },
		zip: { type: DataTypes.STRING, allowNull: true },
		streetAddress: { type: DataTypes.STRING, allowNull: true },
		landRegistryNumber: { type: DataTypes.STRING, allowNull: true },
		houseNumber: { type: DataTypes.STRING, allowNull: true },
		addressPattern: { type: DataTypes.STRING, allowNull: true },
		fullAddress: { type: DataTypes.STRING, allowNull: true },
		telephone: { type: DataTypes.STRING, allowNull: true },
		email: { type: DataTypes.STRING },
		bankName: { type: DataTypes.STRING, allowNull: true },
		bankAccountNumber: { type: DataTypes.STRING, allowNull: true },
		bankCode: { type: DataTypes.STRING, allowNull: true },
		bankIBAN: { type: DataTypes.STRING, allowNull: true },
	},
	{
		timestamps: true,
		paranoid: true,
	}
);

export default WebInformation;
