"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { globalData } from "../../../digitalniweb-types/models/globalData.js";
import AppModule = globalData.AppModule;

const AppModule = db.define<AppModule>(
	"AppModule",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		AppId: {
			type: DataTypes.INTEGER,
		},
		ModuleId: {
			type: DataTypes.INTEGER,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);

export default AppModule;
