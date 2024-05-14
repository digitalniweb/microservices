"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { WidgetContent } from "../../../digitalniweb-types/models/content.js";

const WidgetContent = db.define<WidgetContent>(
	"WidgetContent",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		widgetId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		moduleId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		moduleRecordId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		options: {
			type: DataTypes.JSONB,
		},
		active: {
			type: DataTypes.BOOLEAN,
		},
		order: {
			type: DataTypes.INTEGER,
		},
	},
	{
		timestamps: true,
		paranoid: true,
	}
);

export default WidgetContent;
