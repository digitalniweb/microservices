"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import type { Role as RoleTsType } from "../../../digitalniweb-types/models/globalData.js";
import RoleType from "./roleType.js";

const Role = db.define<RoleTsType>(
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
		RoleTypeId: {
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

Role.belongsTo(RoleType);

RoleType.hasOne(Role);

export default Role;
