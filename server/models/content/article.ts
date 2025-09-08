"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import type { Article as ArticleType } from "../../../digitalniweb-types/models/content.js";
import { getGlobalDataList } from "../../../digitalniweb-custom/helpers/getGlobalData.js";

const Article = db.define<ArticleType>(
	"Article",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		languageId: {
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
		url: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				len: [1, 255],
			},
		},
		icon: {
			type: DataTypes.STRING,
			validate: {
				len: [0, 50],
			},
		},
		otherUrl: {
			type: DataTypes.STRING,
			validate: {
				len: [0, 500],
			},
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
			allowNull: false,
		},
		freeMenu: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		order: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		parentId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: null,
		},
		websiteId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		websitesMsId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING,
		},
		description: {
			type: DataTypes.STRING,
		},
		image: {
			type: DataTypes.STRING,
		},
	},
	{
		timestamps: true,
		paranoid: true,
	}
);

Article.belongsTo(Article, { as: "parent", foreignKey: "parentId" });
Article.beforeDestroy(async (article, options) => {
	if (!options.force) return;
	let articleWidgets = await article.getArticleWidgets();
	let widgets = await getGlobalDataList("widgets");
	if (!widgets) return;
	articleWidgets.forEach(async (aw) => {
		let widget = widgets?.find((w) => aw.widgetId === w.id);
		if (!widget?.model) return;
		let currentWidget = db.models[widget.model];
		await currentWidget?.destroy({
			where: {
				id: aw.widgetRowId,
			},
			transaction: options.transaction,
		});
	});
});

export default Article;
