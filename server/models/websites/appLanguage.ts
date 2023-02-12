"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { websites } from "../../../digitalniweb-types/models/websites.js";
import AppLanguage = websites.AppLanguage;

const AppLanguage = db.define<AppLanguage>(
	"AppLanguage",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		AppId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		languageId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
		// freezeTableName: true,
	}
);
// AppLanguage.removeAttribute("id");

export default AppLanguage;
