import type { Request, Response, NextFunction } from "express";
import db from "../../../models/index.js";

import Widget from "../../../models/globalData/widget.js";
import {
	getRequestGlobalDataModelArray,
	getRequestGlobalDataModelList,
} from "../../../../digitalniweb-custom/helpers/getGlobalData.js";
import type { modules } from "../../../../digitalniweb-types/functionality/modules.js";
import Module from "../../../models/globalData/module.js";

export const getModuleWidgetsIds = async function (
	req: Request,
	res: Response
) {
	let moduleName = req.query.module as modules;

	let moduleWidgets = await Module.findOne({
		where: { name: moduleName },
		attributes: [],
		include: {
			model: Widget,
			attributes: ["id"], // Only fetch IDs
			through: { attributes: [] }, // Exclude junction table attributes
		},
	});

	const widgetIds = moduleWidgets?.Widgets?.map((widget) => widget.id) || [];

	res.send(widgetIds);
};

export const getWidgetsList = async function (req: Request, res: Response) {
	let data = await getRequestGlobalDataModelList(req, Widget);

	res.send(data);
};

export const getArray = async function (req: Request, res: Response) {
	const responseArray = await getRequestGlobalDataModelArray(req, Widget);
	res.send(responseArray);
};

export const getWidgetsByIds = async function (req: Request, res: Response) {
	let ids = req.query.ids as string[] | number[];

	if (!Array.isArray(ids)) throw "Widget IDs needs to be an array.";
	ids = ids.map(Number) as number[];
	if (ids.some((id) => isNaN(id))) throw "Widget IDs needs to be numbers.";
	let widgets = await db.transaction(async (transaction) => {
		return await Widget.findAll({
			where: {
				id: ids,
			},
			transaction,
		});
	});

	res.send(widgets);
};
