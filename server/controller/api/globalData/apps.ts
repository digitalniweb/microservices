import type { Request, Response, NextFunction } from "express";
import App from "../../../models/globalData/app.js";
import { registerApp } from "../../../../custom/helpers/globalData/app.js";
import type { newAppOptions } from "../../../../digitalniweb-types/customFunctions/globalData.js";

export const getApp = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let { name } = req.query as { name?: string };
		if (!name) {
			res.send(false);
			return;
		}
		let appInfo = await App.findOne({
			where: {
				name,
			},
		});
		res.send(appInfo);
	} catch (error) {
		next({ error });
	}
};

export const register = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let app = await registerApp(req.body as newAppOptions, req);

		res.send(app);
	} catch (error) {
		next({ error });
	}
};
