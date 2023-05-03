"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { globalData } from "../../../digitalniweb-types/models/globalData.js";
import App = globalData.App;
import AppLanguage from "./appLanguage.js";
import AppType from "./appType.js";
import Language from "./language.js";

const App = db.define<App>(
	"App",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		parentId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: null,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				len: [4, 255],
			},
		},
		AppTypeId: {
			type: DataTypes.INTEGER,
			references: {
				model: AppType.tableName,
				key: "id",
			},
		},
		websiteId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			unique: "uniqueHostPort",
		},
		port: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: "uniqueHostPort",
		},
		uniqueName: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		apiKey: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		LanguageId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: AppLanguage.tableName,
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

App.belongsTo(App, { as: "parent", foreignKey: "parentId" });

App.hasOne(App, {
	as: "child",
	foreignKey: "parentId",
});

App.belongsToMany(Language, {
	through: AppLanguage.tableName,
});
Language.hasMany(App);

App.belongsTo(Language);

App.belongsTo(AppType);

export default App;
