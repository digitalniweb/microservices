"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import type { Currency as CurrencyType } from "../../../digitalniweb-types/models/globalData.js";

const Currency = db.define<CurrencyType>(
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
