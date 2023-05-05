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