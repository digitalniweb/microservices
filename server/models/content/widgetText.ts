"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import type { WidgetText as WidgetTextType } from "../../../digitalniweb-types/models/content.js";
import Article from "./article.js";
import ArticleWidget from "./articleWidget.js";

const WidgetText = db.define<WidgetTextType>(
	"WidgetText",
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
			// set() and get() work only on direct manipulation not in includes (associations) so it is useless in here
			// get() {
			// 	let options = this.getDataValue("options");
			// 	if (typeof options === "string") return JSON.parse(options);
			// 	return options;
			// },
			// set(value) {
			// 	let options = value as serializableJSON<widgetTextOptions> | string;
			// 	if (typeof value !== "string") options = JSON.stringify(value);
			// 	this.setDataValue("options", options);
			// },
		},
	},
	{
		timestamps: false,
		paranoid: false,
	}
);

ArticleWidget.belongsTo(Article);
Article.hasMany(ArticleWidget);

WidgetText.hasMany(ArticleWidget, {
	foreignKey: "widgetRowId",
});

export default WidgetText;
