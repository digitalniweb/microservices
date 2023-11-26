import { NextFunction, Request, Response } from "express";
import db from "../../../models/index.js";

import Language from "../../../models/globalData/language.js";

export const getLanguagesList = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let languages = await db.transaction(async (transaction) => {
			return await Language.findAll({
				transaction,
			});
		});

		return res.send(languages);
	} catch (error) {
		return next({
			error,
			code: 500,
			message: "Couldn't get languages list.",
		});
	}
};

export const getLanguagesByIds = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let ids = req.query.ids as [];

		if (!Array.isArray(ids)) throw "Language IDs needs to be an array.";
		if (!ids) throw "You haven't specified language IDs.";
		if (ids.some((id) => isNaN(Number(id))))
			throw "Language IDs needs to be numbers.";
		let languages = await db.transaction(async (transaction) => {
			return await Language.findAll({
				where: {
					id: ids,
				},
				transaction,
			});
		});

		return res.send(languages);
	} catch (error) {
		return next({
			error,
			code: 500,
			message: "Couldn't get languages list.",
		});
	}
};
