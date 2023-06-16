"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { content } from "../../../digitalniweb-types/models/content.js";
import WidgetContent = content.WidgetContent;

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
			type: DataTypes.STRING,
			allowNull: false,
		},
		options: {
			type: DataTypes.JSONB,
			allowNull: false,
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		order: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		timestamps: true,
		paranoid: true,
	}
);

export default WidgetContent;
