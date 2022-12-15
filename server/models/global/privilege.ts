"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { global } from "../../../types/models/global.js";
import Privilege = global.Privilege;

const Privilege = db.define<Privilege>(
	"Privilege",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		type: {
			// login type to web section -> /admin or /modules
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);

export default Privilege;
