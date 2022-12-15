import { NextFunction, Request, Response } from "express";
import db from "../../../models/index.js";

import Website from "../../../models/websites/website.js";
import Url from "../../../models/websites/url.js";

export const getWebsiteLanguageMutations = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	// only mutations of website, without main language (which I get with website information)
	try {
		let { url } = req.query;
		let websiteLanguageMutations = await db.transaction(async (transaction) => {
			/* return await Language.findAll({
				transaction,
				where: {
					"$Websites.MainUrl.url$": url,
				},
				include: [
					{
						model: Website,
						attributes: [],
						include: [
							{
								model: Url,
								as: "MainUrl",
							},
						],
					},
				],
			}); */
		});
		return res.send(websiteLanguageMutations);
	} catch (error) {
		return next({
			error,
			code: 500,
			message: "Couldn't get app languages list.",
		});
	}
};
