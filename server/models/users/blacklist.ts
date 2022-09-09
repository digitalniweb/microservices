"use strict";

import { DataTypes } from "sequelize";

import db from "../index";

import { users } from "../../../types/models/users";
import Blacklist = users.Blacklist;

const Blacklist = db.define<Blacklist>(
	"Blacklist",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		service: {
			// login, form...
			type: DataTypes.STRING,
			allowNull: false,
		},
		type: {
			// IP, userMail...
			type: DataTypes.STRING,
			allowNull: false,
		},
		value: {
			// IP, user's mail...
			type: DataTypes.STRING,
			allowNull: false,
		},
		reason: {
			type: DataTypes.STRING,
		},
		otherData: {
			type: DataTypes.JSON,
		},
		blockedTill: {
			type: DataTypes.DATE,
			allowNull: false, // indefinitely = high date
		},
	},
	{
		timestamps: true, // createdAt, updatedAt
		updatedAt: false, // turn off updatedAt
		paranoid: true, // can be unblocked
	}
);

export default Blacklist;
