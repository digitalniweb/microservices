import type { Request, Response } from "express";
import db from "../../../models/index.js";
import Article from "../../../models/content/article.js";
import type { saveNewArticleRequestBody } from "../../../../digitalniweb-types/apps/communication/modules/articles.js";
import ArticleWidget from "../../../models/content/articleWidget.js";
import WidgetText from "../../../models/content/widgetText.js";

export const createWebsiteFirstArticle = async function (
	req: Request,
	res: Response
) {
	let article = req.body as saveNewArticleRequestBody;
	let webInfo = await db.transaction(async (transaction) => {
		let existingArticle = await Article.findOne({
			where: {
				websiteId: article.menu.websiteId,
				websitesMsId: article.menu.websitesMsId,
				languageId: article.menu.languageId,
			},
		});
		if (existingArticle) return existingArticle;
		let newArticle = article.menu;
		newArticle.ArticleWidgets = article.widgets?.new;
		return await Article.create(newArticle, {
			transaction,
			include: [
				{ model: ArticleWidget, include: [{ model: WidgetText }] },
			],
		});
	});

	res.json(webInfo);
};
