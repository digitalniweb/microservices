"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { ModulePage } from "../../../digitalniweb-types/models/globalData.js";
import Module from "./module.js";

const ModulePage = db.define<ModulePage>(
	"ModulePage",
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
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		component: {
			type: DataTypes.STRING,
		},
		url: {
			type: DataTypes.STRING,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);

Module.hasMany(ModulePage);
ModulePage.belongsTo(Module);

export default ModulePage;
