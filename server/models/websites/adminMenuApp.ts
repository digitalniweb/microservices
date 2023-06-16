"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { websites } from "../../../digitalniweb-types/models/websites.js";
import AdminMenuApp = websites.AdminMenuApp;

const AdminMenuApp = db.define<AdminMenuApp>(
	"AdminMenuApp",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		appId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		adminMenuId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);

export default AdminMenuApp;
