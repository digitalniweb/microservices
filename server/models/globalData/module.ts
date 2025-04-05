"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import type { Module as ModuleType } from "../../../digitalniweb-types/models/globalData.js";

const Module = db.define<ModuleType>(
	"Module",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		model: {
			type: DataTypes.STRING,
		},
		component: {
			type: DataTypes.STRING,
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
