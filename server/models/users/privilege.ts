"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { users } from "../../../types/models/users.js";
import Privilege = users.Privilege;

import UserPrivilege from "./userPrivilege.js";

import User from "./user.js";

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
Privilege.belongsToMany(User, {
	through: UserPrivilege.tableName,
});

User.belongsToMany(Privilege, {
	through: UserPrivilege.tableName,
});

export default Privilege;
