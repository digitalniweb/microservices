import { NextFunction, Request, Response } from "express";
import db from "../../../models/index.js";

import Widget from "../../../models/globalData/widget.js";
import { getRequestGlobalDataModelList } from "../../../../digitalniweb-custom/helpers/getGlobalData.js";

export const getWidgetsList = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let data = await getRequestGlobalDataModelList(req, Widget);

		return res.send(data);
	} catch (error) {
		return next({
			error,
			code: 500,
			message: "Couldn't get widgets list.",
		});
	}
};

export const getWidgetsByIds = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let ids = req.query.ids as string[] | number[];

		if (!Array.isArray(ids)) throw "Widget IDs needs to be an array.";
		ids = ids.map(Number) as number[];
		if (ids.some((id) => isNaN(id)))
			throw "Widget IDs needs to be numbers.";
		let widgets = await db.transaction(async (transaction) => {
			return await Widget.findAll({
				where: {
					id: ids,
				},
				transaction,
			});
		});

		return res.send(widgets);
	} catch (error) {
		return next({
			error,
			code: 500,
			message: "Couldn't get widgets list.",
		});
	}
};
