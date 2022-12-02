"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { websites } from "../../../types/models/websites.js";
import AppLanguage = websites.AppLanguage;

const AppLanguage = db.define<AppLanguage>(
	"AppLanguage",
	{
		AppId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		LanguageId: {
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

export default AppLanguage;
