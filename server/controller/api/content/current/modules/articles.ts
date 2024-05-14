import { Request, Response, NextFunction } from "express";
import db from "../../../../../models/index.js";
export const getArticle = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		return res.send("articles");
	} catch (error: any) {
		return next({
			error,
			code: 500,
			message: "Couldn't get current Article",
		});
	}
};
