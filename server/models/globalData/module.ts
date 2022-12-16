"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { globalData } from "../../../types/models/globalData.js";
import Module = globalData.Module;

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
		creditsCost: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);

export default Module;
