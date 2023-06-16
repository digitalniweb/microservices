"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { globalData } from "../../../digitalniweb-types/models/globalData.js";
import AdminMenuLanguage = globalData.AdminMenuLanguage;
import Language from "./language.js";
import AdminMenu from "./adminMenu.js";

const AdminMenuLanguage = db.define<AdminMenuLanguage>(
	"AdminMenuLanguage",
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
		url: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		LanguageId: {
			type: DataTypes.INTEGER,
			references: {
				model: Language.tableName,
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
AdminMenuLanguage.belongsTo(AdminMenu);
AdminMenuLanguage.belongsTo(Language);

export default AdminMenuLanguage;
