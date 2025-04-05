"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import type { AdminMenuModule as AdminMenuModuleType } from "../../../digitalniweb-types/models/globalData.js";
import Module from "./module.js";
import AdminMenu from "./adminMenu.js";

const AdminMenuModule = db.define<AdminMenuModuleType>(
	"AdminMenuModule",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		ModuleId: {
			type: DataTypes.INTEGER,
			references: {
				model: Module.tableName,
				key: "id",
			},
		},
		AdminMenuId: {
			type: DataTypes.INTEGER,
			references: {
				model: AdminMenu.tableName,
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
AdminMenu.belongsToMany(Module, { through: AdminMenuModule });
Module.belongsToMany(AdminMenu, { through: AdminMenuModule });
export default AdminMenuModule;
