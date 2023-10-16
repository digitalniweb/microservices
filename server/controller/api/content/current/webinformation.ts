import { Request, Response, NextFunction } from "express";

export const webinformation = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	console.log(req.headers);

	res.send("ok");
};
