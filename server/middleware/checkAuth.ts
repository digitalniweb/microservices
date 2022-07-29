// const models = require("../models/index");
import { Request, Response, NextFunction } from "express";

export default async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		return next();
	} catch (error) {
		return next({ error, code: "401", message: "Wrong authentication" });
	}
}
