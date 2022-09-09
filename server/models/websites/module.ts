"use strict";

import { DataTypes } from "sequelize";

import db from "../index";

import { websites } from "../../../types/models/websites";
import Module = websites.Module;
import Website from "./website";
import ModulesPagesLanguage from "./modulesPagesLanguage";
import WebsiteModule from "./WebsiteModule";

const Module = db.define<Module>(
	"Module",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		// if module has its own db table URL (i.e. 'news' module has 'news' table) or is just a page component (or no page at all)
		dedicatedTable: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		usersRoleId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: null,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);

Module.hasMany(ModulesPagesLanguage);
ModulesPagesLanguage.belongsTo(Module);

export default Module;
