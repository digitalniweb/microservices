"use strict";

import { DataTypes } from "sequelize";

import db from "../index";

import { websites } from "../../../types/models/websites";
import Language = websites.Language;
import ModulesPagesLanguage from "./modulesPagesLanguage";
import WebsiteLanguageMutation from "./websiteLanguageMutation";
import Website from "./website";

const Language = db.define<Language>(
	"Language",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		code: {
			type: DataTypes.STRING(7),
			allowNull: false,
			validate: {
				max: 7,
			},
		},
		name: {
			// english name
			type: DataTypes.STRING(63),
			allowNull: false,
		},
		icon: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
		// freezeTableName: true,
	}
);

ModulesPagesLanguage.belongsTo(Language);

Website.belongsTo(Language, { as: "MainLanguage" });
Website.belongsToMany(Language, {
	through: WebsiteLanguageMutation.tableName,
});

export default Language;
