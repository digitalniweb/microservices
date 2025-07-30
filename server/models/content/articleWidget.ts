"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import type { ArticleWidget as ArticleWidgetType } from "../../../digitalniweb-types/models/content.js";
import Article from "./article.js";

const ArticleWidget = db.define<ArticleWidgetType>(
	"ArticleWidget",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		ArticleId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Article.tableName,
				key: "id",
			},
		},
		widgetId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		widgetRowId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		order: {
			type: DataTypes.INTEGER,
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
			allowNull: false,
		},
	},
	{
		timestamps: true,
		paranoid: true,
	}
);

export default ArticleWidget;
