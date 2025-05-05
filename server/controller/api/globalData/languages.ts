import type { Request, Response, NextFunction } from "express";
import db from "../../../models/index.js";

import Language from "../../../models/globalData/language.js";
import {
	getRequestGlobalDataModelArray,
	getRequestGlobalDataModelList,
} from "../../../../digitalniweb-custom/helpers/getGlobalData.js";

export const getLanguagesList = async function (req: Request, res: Response) {
	let data = await getRequestGlobalDataModelList(req, Language);

	res.send(data);
};

export const getLanguagesByIds = async function (req: Request, res: Response) {
	let ids = req.query.ids as string[] | number[];

	if (!Array.isArray(ids)) throw "Language IDs needs to be an array.";
	ids = ids.map(Number) as number[];
	if (ids.some((id) => isNaN(id))) throw "Language IDs needs to be numbers.";
	let languages = await db.transaction(async (transaction) => {
		return await Language.findAll({
			where: {
				id: ids,
			},
			transaction,
		});
	});

	res.send(languages);
};
export const getArray = async function (req: Request, res: Response) {
	const responseArray = await getRequestGlobalDataModelArray(req, Language);
	res.send(responseArray);
};
