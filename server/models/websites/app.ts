"use strict";

import { DataTypes } from "sequelize";

import db from "../index";

import { websites } from "../../../types/models/websites";
import App = websites.App;
import Website from "./website";
import Language from "./language";
import AppLanguage from "./appLanguage";

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
		AppTypeId: {
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

App.belongsToMany(Language, {
	through: AppLanguage.tableName,
});

export default App;
