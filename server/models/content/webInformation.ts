"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import type { WebInformation as WebInformationType } from "../../../digitalniweb-types/models/content.js";

const WebInformation = db.define<WebInformationType>(
	"WebInformation",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: { type: DataTypes.STRING },
		mainImage: { type: DataTypes.STRING, allowNull: true },
		logo: { type: DataTypes.STRING, allowNull: true },
		favicon: { type: DataTypes.STRING },
		googleTagManager: { type: DataTypes.STRING, allowNull: true },
		googleTagManagerActive: {
			type: DataTypes.BOOLEAN,
			defaultValue: 0,
		},
		websiteId: { type: DataTypes.INTEGER },
		websitesMsId: { type: DataTypes.INTEGER },
		owner: { type: DataTypes.STRING },
		tin: { type: DataTypes.STRING },
		vatId: { type: DataTypes.STRING },
		country: { type: DataTypes.STRING },
		city: { type: DataTypes.STRING },
		zip: { type: DataTypes.STRING },
		streetAddress: { type: DataTypes.STRING },
		landRegistryNumber: { type: DataTypes.STRING, allowNull: true },
		houseNumber: { type: DataTypes.STRING, allowNull: true },
		addressPattern: { type: DataTypes.STRING },
		fullAddress: { type: DataTypes.STRING },
		telephone: { type: DataTypes.STRING },
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
