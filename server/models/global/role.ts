"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { global } from "../../../types/models/global.js";
import Role = global.Role;

const Role = db.define<Role>(
	"Role",
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
		// freezeTableName: true,
		// tableName: 'Roles',
	}
);

/* User.belongsToMany(Privilege, {
	through: UserPrivilege.tableName,
});

Privilege.hasMany(User); */

export default Role;
