import { NextFunction, Request, Response } from "express";
import db from "../../../models/index.js";

import Language from "../../../models/websites/language.js";
import App from "../../../models/websites/app.js";
import Website from "../../../models/websites/website.js";
import Url from "../../../models/websites/url.js";

export const getLanguagesList = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let { app } = req.query;

		let appLanguages = await db.transaction(async (transaction) => {
			return await Language.findAll({
				transaction,
				include: [
					{
						where: {
							name: app,
						},
						model: App,
						attributes: [],
					},
				],
			});
		});

		return res.send(appLanguages);
	} catch (error) {
		return next({
			error,
			code: 500,
			message: "Couldn't get app languages list.",
		});
	}
};

export const getWebsiteLanguageMutations = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	// only mutations of website, without main language (which I get with website information)
	try {
		let { url } = req.query;
		let websiteLanguageMutations = await db.transaction(async (transaction) => {
			return await Language.findAll({
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
			});
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
