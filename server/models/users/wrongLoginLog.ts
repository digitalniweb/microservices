"use strict";

// !!! delete and put to logs_ms ?

import { DataTypes } from "sequelize";

import db from "../index.js";

import type { WrongLoginLog as WrongLoginLogType } from "../../../digitalniweb-types/models/users.js";

const WrongLoginLog = db.define<WrongLoginLogType>(
	"WrongLoginLog",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		userLogin: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		websiteId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		websitesMsId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		ip: {
			type: DataTypes.STRING,
			validate: {
				isIP: true,
			},
		},
		unsuccessfulCount: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		timestamps: true, // createdAt, updatedAt
		updatedAt: false, // turn off updatedAt
		paranoid: false, // deletedAt
	}
);

export default WrongLoginLog;
