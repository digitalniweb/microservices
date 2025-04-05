"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import type { UserPrivilege as UserPrivilegeType } from "../../../digitalniweb-types/models/users.js";

const UserPrivilege = db.define<UserPrivilegeType>(
	"UserPrivilege",
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
		actionId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);

export default UserPrivilege;
