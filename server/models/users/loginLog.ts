"use strict";

// !!! delete and put to logs_ms ?

import { DataTypes } from "sequelize";

import db from "../index.js";

import User from "./user.js";

import type { LoginLog as LoginLogType } from "../../../digitalniweb-types/models/users.js";

const LoginLog = db.define<LoginLogType>(
	"LoginLog",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		UserId: {
			type: DataTypes.INTEGER,
			allowNull: false,
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
		successful: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
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

LoginLog.belongsTo(User);
User.hasMany(LoginLog);

export default LoginLog;
