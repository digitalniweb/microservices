import { Request, Response, NextFunction } from "express";

import { userAuthenticate } from "../../../../custom/helpers/userAuthenticate";

export const test = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		return res.send("ok");
	} catch (error) {
		return next(error);
	}
};
