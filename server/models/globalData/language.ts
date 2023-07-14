"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { Language } from "../../../digitalniweb-types/models/globalData.js";

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

export default Language;
