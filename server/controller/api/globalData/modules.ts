import { NextFunction, Request, Response } from "express";
import db from "../../../models/index.js";

import Module from "../../../models/globalData/module.js";
import { getRequestGlobalDataModelList } from "../../../../digitalniweb-custom/helpers/getGlobalData.js";
import ModulesPagesLanguage from "../../../models/globalData/modulesPagesLanguage.js";

export const getModulesList = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let data = getRequestGlobalDataModelList(req, Module);

		return res.send(data);
	} catch (error) {
		return next({
			error,
			code: 500,
			message: "Couldn't get modules list.",
		});
	}
};

export const getModulesByIds = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let ids = req.query.ids as string[] | number[];

		if (!Array.isArray(ids)) throw "Module IDs needs to be an array.";
		ids = ids.map(Number) as number[];
		if (ids.some((id) => isNaN(id)))
			throw "Module IDs needs to be numbers.";
		let modules = await db.transaction(async (transaction) => {
			return await Module.findAll({
				where: {
					id: ids,
				},
				transaction,
				include: [ModulesPagesLanguage],
			});
		});

		return res.send(modules);
	} catch (error) {
		return next({
			error,
			code: 500,
			message: "Couldn't get modules list.",
		});
	}
};
