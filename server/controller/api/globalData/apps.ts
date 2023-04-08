import { Request, Response, NextFunction } from "express";
import { appInfoType } from "../../../../digitalniweb-types/index.js";
import App from "../../../models/globalData/app.js";
import { registerApp } from "../../../../custom/helpers/globalData/app.js";

export const getApp = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let { app } = req.query as { app?: string };
		if (!app) return false;
		let appInfo = await App.findOne({
			where: {
				name: app,
			},
		});
		return res.send(appInfo);
	} catch (error) {
		console.log(error);
		return false;
	}
};

export const register = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let app = await registerApp(req.body as appInfoType);

		return res.send(app);
	} catch (error) {
		return next(error);
	}
};
