"use strict";

import { DataTypes } from "sequelize";

import db from "../index";

import User from "./user";

import { users } from "../../../types/models/users";
import LoginLog = users.LoginLog;

const LoginLog = db.define<LoginLog>(
	"LoginLog",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		userLogin: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		UserId: {
			type: DataTypes.INTEGER,
		},
		ip: {
			type: DataTypes.STRING,
			validate: {
				isIP: true,
			},
		},
		userAgent: {
			type: DataTypes.JSON,
		},
		successful: {
			type: DataTypes.BOOLEAN,
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

export default LoginLog;
