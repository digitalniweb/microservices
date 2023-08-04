"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { UserPrivilege } from "../../../digitalniweb-types/models/users.js";

const UserPrivilege = db.define<UserPrivilege>(
	"UserPrivilege",
	{
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
