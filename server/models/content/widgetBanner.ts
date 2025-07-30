"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import type { WidgetBanner as WidgetBannerType } from "../../../digitalniweb-types/models/content.js";
import Article from "./article.js";
import ArticleWidget from "./articleWidget.js";

const WidgetBanner = db.define<WidgetBannerType>(
	"WidgetBanner",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		moduleId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 255],
			},
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		options: {
			type: DataTypes.JSON,
			allowNull: true,
		},
	},
	{
		timestamps: false,
		paranoid: false,
	}
);

ArticleWidget.belongsTo(WidgetBanner, {
	foreignKey: "widgetRowId",
	scope: { moduleId: 1 },
});
WidgetBanner.hasMany(ArticleWidget, {
	foreignKey: "widgetRowId",
});
export default WidgetBanner;
