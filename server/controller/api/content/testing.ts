import type { Request, Response, NextFunction } from "express";

import Article from "../../../models/content/article.js";
import ArticleWidget from "../../../models/content/articleWidget.js";
import WidgetText from "../../../models/content/widgetText.js";
import WidgetBanner from "../../../models/content/widgetBanner.js";

export const test = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	let article = await Article.findOne({
		include: [
			// make this automatic for all associations
			{
				model: ArticleWidget,
				where: { active: true },
				paranoid: true,
				order: [["order", "ASC"]],
				include: [
					{
						model: WidgetText,
					},
					{
						model: WidgetBanner,
					},
				],
			},
		],
	});
	res.send({ article });
};
export const testPost = async function (req: Request, res: Response) {
	res.send("test");
};
