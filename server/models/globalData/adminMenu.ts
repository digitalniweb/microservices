"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { AdminMenu } from "../../../digitalniweb-types/models/globalData.js";
import Module from "./module.js";

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
			allowNull: false,
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
		isDefault: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		separator: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		ModuleId: {
			type: DataTypes.INTEGER,
			references: {
				model: Module.tableName,
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
AdminMenu.belongsTo(Module);
Module.hasMany(AdminMenu);
AdminMenu.belongsTo(AdminMenu, { as: "parent", foreignKey: "parentId" });

export default AdminMenu;
