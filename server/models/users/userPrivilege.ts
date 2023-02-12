"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { users } from "../../../digitalniweb-types/models/users.js";
import UserPrivilege = users.UserPrivilege;

const UserPrivilege = db.define<UserPrivilege>(
	"UserPrivilege",
	{
		UserId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		privilegeId: {
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
