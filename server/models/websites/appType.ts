"use strict";

import { DataTypes } from "sequelize";

import db from "../index";

import { websites } from "../../../types/models";
import AppType = websites.AppType;

const AppType = db.define<AppType>(
	"AppType",
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				len: [1, 255],
			},
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
		// freezeTableName: true,
	}
);

export default AppType;
