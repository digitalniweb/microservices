"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { globalData } from "../../../digitalniweb-types/models/globalData.js";
import ModulesPagesLanguage = globalData.ModulesPagesLanguage;
import Module from "./module.js";
import Language from "./language.js";

const ModulesPagesLanguage = db.define<ModulesPagesLanguage>(
	"ModulesPagesLanguage",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		ModuleId: {
			type: DataTypes.INTEGER,
			references: {
				model: Module.tableName,
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

ModulesPagesLanguage.belongsTo(Module);
ModulesPagesLanguage.belongsTo(Language);

export default ModulesPagesLanguage;
