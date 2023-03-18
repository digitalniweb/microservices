"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { globalData } from "../../../digitalniweb-types/models/globalData.js";
import AppLanguage = globalData.AppLanguage;
import Language from "./language.js";

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
		LanguageId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Language.tableName,
				key: "id",
			},
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
