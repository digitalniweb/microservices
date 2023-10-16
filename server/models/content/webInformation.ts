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
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		value: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		websiteId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		websitesMsId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		timestamps: true,
		paranoid: true,
	}
);

export default WebInformation;
