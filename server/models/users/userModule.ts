"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import type { UserModule as UserModuleType } from "../../../digitalniweb-types/models/users.js";

const UserModule = db.define<UserModuleType>(
	"UserModule",
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
		moduleId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);

export default UserModule;
