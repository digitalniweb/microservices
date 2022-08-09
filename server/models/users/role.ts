"use strict";

import { DataTypes } from "sequelize";

import db from "../index";

import { users } from "../../../types/models";
import Role = users.Role;

import User from "./user";

const Role = db.define<Role>(
	"Role",
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
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
		// freezeTableName: true,
		// tableName: 'Roles',
	}
);

Role.hasMany(User);

export default Role;
