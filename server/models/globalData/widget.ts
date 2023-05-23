"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { globalData } from "../../../digitalniweb-types/models/globalData.js";
import Widget = globalData.Widget;

const Widget = db.define<Widget>(
	"Widget",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		widgetName: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
		// freezeTableName: true,
	}
);
export default Widget;
