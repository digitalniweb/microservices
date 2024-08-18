"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { AdminMenu } from "../../../digitalniweb-types/models/globalData.js";
import Role from "./role.js";

const AdminMenu = db.define<AdminMenu>(
	"AdminMenu",
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
		component: {
			type: DataTypes.STRING,
		},
		order: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		icon: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		parentId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: null,
		},
		openable: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		separator: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		RoleId: {
			type: DataTypes.INTEGER,
			references: {
				model: Role.tableName,
				key: "id",
			},
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
		// freezeTableName: true,
	}
);

AdminMenu.belongsTo(Role);
Role.hasMany(AdminMenu);

AdminMenu.belongsTo(AdminMenu, { as: "parent", foreignKey: "parentId" });
AdminMenu.hasMany(AdminMenu, {
	as: "children",
	foreignKey: "parentId",
});

export default AdminMenu;
