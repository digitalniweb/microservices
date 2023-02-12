"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { globalData } from "../../../digitalniweb-types/models/globalData.js";
import Currency = globalData.Currency;

const Currency = db.define<Currency>(
	"Currency",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		sign: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				len: [1, 4],
			},
		},
		code: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				len: [3, 3],
			},
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);

export default Currency;
