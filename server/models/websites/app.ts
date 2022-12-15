"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { websites } from "../../../types/models/websites.js";
import App = websites.App;
import Website from "./website.js";
import AppLanguage from "./appLanguage.js";

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
		port: {
			type: DataTypes.INTEGER,
			unique: true,
		},
		appTypeId: {
			type: DataTypes.INTEGER,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
		// freezeTableName: true,
	}
);

Website.belongsTo(App);

App.belongsTo(App, { as: "parent", foreignKey: "parentId" });

App.hasOne(App, {
	as: "child",
	foreignKey: "parentId",
});

AppLanguage.belongsTo(App);
App.hasMany(AppLanguage);

export default App;
