"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { ModulePageLanguage } from "../../../digitalniweb-types/models/globalData.js";
import Language from "./language.js";
import ModulePage from "./modulePage.js";

const ModulePageLanguage = db.define<ModulePageLanguage>(
	"ModulePageLanguage",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		ModulePageId: {
			type: DataTypes.INTEGER,
			references: {
				model: ModulePage.tableName,
				key: "id",
			},
		},
		LanguageId: {
			type: DataTypes.INTEGER,
			references: {
				model: Language.tableName,
				key: "id",
			},
		},
		url: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		headline: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		image: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		options: DataTypes.JSON,
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);

ModulePageLanguage.belongsTo(Language);

ModulePage.hasMany(ModulePageLanguage);
ModulePageLanguage.belongsTo(ModulePage);

export default ModulePageLanguage;
