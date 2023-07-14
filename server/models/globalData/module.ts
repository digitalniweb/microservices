"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { Module } from "../../../digitalniweb-types/models/globalData.js";

const Module = db.define<Module>(
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
