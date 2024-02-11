"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { WebInformationLanguage } from "../../../digitalniweb-types/models/content.js";
import WebInformation from "./webInformation.js";

const WebInformationLanguage = db.define<WebInformationLanguage>(
	"WebInformationLanguage",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		WebInformationId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: WebInformation.tableName,
				key: "id",
			},
		},
		name: { type: DataTypes.STRING, allowNull: true },
		description: { type: DataTypes.STRING, allowNull: true },
		motto: { type: DataTypes.STRING, allowNull: true },
		titlePostfix: { type: DataTypes.STRING, allowNull: true },
		mainImage: { type: DataTypes.STRING, allowNull: true },
		logo: { type: DataTypes.STRING, allowNull: true },
		socialMedia: { type: DataTypes.TEXT, allowNull: true },
		languageId: { type: DataTypes.INTEGER },
	},
	{
		timestamps: true,
		paranoid: true,
	}
);

WebInformationLanguage.belongsTo(WebInformation);
WebInformation.hasMany(WebInformationLanguage);

export default WebInformationLanguage;
