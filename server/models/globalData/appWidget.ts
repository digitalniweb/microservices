"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { globalData } from "../../../digitalniweb-types/models/globalData.js";
import AppWidget = globalData.AppWidget;

const AppWidget = db.define<AppWidget>(
	"AppWidget",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		AppId: {
			type: DataTypes.INTEGER,
		},
		WidgetId: {
			type: DataTypes.INTEGER,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);

export default AppWidget;
