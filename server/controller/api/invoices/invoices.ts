import { Request, Response, NextFunction } from "express";

export const test = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		return res.send({ message: "it works" });
	} catch (error) {
		return next(error);
	}
};
