"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import type { ModuleWidget as ModuleWidgetType } from "../../../digitalniweb-types/models/globalData.js";
import Module from "./module.js";
import Widget from "./widget.js";

const ModuleWidget = db.define<ModuleWidgetType>(
	"ModuleWidget",
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
		WidgetId: {
			type: DataTypes.INTEGER,
			references: {
				model: Widget.tableName,
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
Widget.belongsToMany(Module, { through: ModuleWidget });
Module.belongsToMany(Widget, { through: ModuleWidget });
export default ModuleWidget;
