import type { NextFunction, Request, Response } from "express";

import Article from "../../../models/content/article.js";
import ArticleWidget from "../../../models/content/articleWidget.js";
import WidgetBanner from "../../../models/content/widgetBanner.js";
import WidgetText from "../../../models/content/widgetText.js";

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
				separate: true, // this makes ordering work
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
