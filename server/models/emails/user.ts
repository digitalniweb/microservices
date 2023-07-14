"use strict";
import { DataTypes } from "sequelize";

import db from "../index.js";

import { User } from "../../../digitalniweb-types/models/emails.js";

const User = db.define<User>(
	"User",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		discUsageMax: {
			type: DataTypes.INTEGER,
		},
		discUsageCurrent: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		messageCountMax: {
			type: DataTypes.INTEGER,
		},
		messageCountCurrent: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		mailboxName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		websitesMsId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);
export default User;
