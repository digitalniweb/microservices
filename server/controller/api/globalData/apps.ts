import type { Request, Response, NextFunction } from "express";
import App from "../../../models/globalData/app.js";
import { registerApp } from "../../../../custom/helpers/globalData/app.js";
import type { newAppOptions } from "../../../../digitalniweb-types/customFunctions/globalData.js";

export const getApp = async function (req: Request, res: Response) {
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
};

export const register = async function (req: Request, res: Response) {
	let app = await registerApp(req.body as newAppOptions, req);

	res.send(app);
};
