"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import type { Widget as WidgetType } from "../../../digitalniweb-types/models/globalData.js";

const Widget = db.define<WidgetType>(
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
		component: {
			type: DataTypes.STRING,
			allowNull: true,
			unique: true,
		},
		icon: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
		// freezeTableName: true,
	}
);
export default Widget;
