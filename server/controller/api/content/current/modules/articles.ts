import { Request, Response, NextFunction } from "express";
import db from "../../../../../models/index.js";
import Article from "../../../../../models/content/article.js";
import WidgetContent from "../../../../../models/content/widgetContent.js";
import { getArticleQuery } from "../../../../../../digitalniweb-types/apps/communication/modules/articles.js";
import { resourceIdsType } from "../../../../../../digitalniweb-types/apps/communication/index.js";
import { moduleResponse } from "../../../../../../digitalniweb-types/apps/communication/modules/index.js";
import Widget from "../../../../../models/globalData/widget.js";
export const getArticle = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let { resourceIds, url } = req.query as getArticleQuery;
		if (typeof resourceIds === "string")
			resourceIds = JSON.parse(resourceIds) as resourceIdsType;

		let response = {} as moduleResponse<Article>;

		let article = await db.transaction(async (transaction) => {
			return await Article.findOne({
				where: {
					languageId: resourceIds.languageId,
					websiteId: resourceIds.websiteId,
					websitesMsId: resourceIds.websitesMsId,
					url,
				},
				transaction,
			});
		});

		if (!article) return res.send(null);
		response.moduleInfo = article;

		let widgetContents = await db.transaction(async (transaction) => {
			return await WidgetContent.findAll({
				where: {
					moduleRecordId: article.id,
					moduleId: resourceIds.moduleId,
					active: true,
				},
				transaction,
			});
		});
		response.widgetContents = widgetContents;

		return res.send(response);
	} catch (error: any) {
		return next({
			error,
			code: 500,
			message: "Couldn't get current Article",
		});
	}
};
