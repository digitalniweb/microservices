import { NextFunction, Request, Response } from "express";
import db from "../../../models/index.js";

import AdminMenu from "../../../models/globalData/adminMenu.js";
import { getRequestGlobalDataModelList } from "../../../../digitalniweb-custom/helpers/getGlobalData.js";
import AdminMenuPageLanguage from "../../../models/globalData/adminMenuLanguage.js";

export const getAdminMenuList = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let data = await getRequestGlobalDataModelList(req, AdminMenu);

		return res.send(data);
	} catch (error) {
		return next({
			error,
			code: 500,
			message: "Couldn't get adminmenu list.",
		});
	}
};

export const getAdminMenuByIds = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let ids = req.query.ids as string[] | number[];

		if (!Array.isArray(ids)) throw "AdminMenu IDs needs to be an array.";
		ids = ids.map(Number) as number[];
		if (ids.some((id) => isNaN(id)))
			throw "AdminMenu IDs needs to be numbers.";
		let adminmenu = await db.transaction(async (transaction) => {
			return await AdminMenu.findAll({
				where: {
					id: ids,
				},
				transaction,
				include: [
					{
						model: AdminMenuPageLanguage,
					},
				],
			});
		});

		return res.send(adminmenu);
	} catch (error) {
		return next({
			error,
			code: 500,
			message: "Couldn't get adminmenu list.",
		});
	}
};
