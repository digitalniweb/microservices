"use strict";

import { DataTypes, type Model, type ModelStatic } from "sequelize";

import db from "../index.js";

import type { ArticleWidget as ArticleWidgetType } from "../../../digitalniweb-types/models/content.js";
import Article from "./article.js";
import { getGlobalDataList } from "../../../digitalniweb-custom/helpers/getGlobalData.js";

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

// /**
//  * Returns associanted model of model by name
//  * @param model ModelStatic<Model>
//  * @param wantedModelName string
//  * @returns ModelStatic<Model>
//  */
// function getModelAssociation<I extends ModelStatic<Model>, W extends string>(
// 	model: I,
// 	wantedModelName: W
// ): I["associations"][W]["target"] | undefined {
// 	let currentAssociation = Object.values(model.associations).find((assoc) => {
// 		return assoc.target.name == wantedModelName;
// 	});
// 	return currentAssociation?.target;
// }
// console.log(getModelAssociation(ArticleWidget, "WidgetText"));

ArticleWidget.afterDestroy(async (aw) => {
	let widgets = await getGlobalDataList("widgets");
	if (!widgets) return;
	let widget = widgets?.find((w) => aw.widgetId === w.id);
	if (!widget?.model) return;
	let currentWidget = db.models[widget.model];
	await currentWidget?.destroy({
		where: {
			id: aw.widgetRowId,
		},
	});
});
export default ArticleWidget;
