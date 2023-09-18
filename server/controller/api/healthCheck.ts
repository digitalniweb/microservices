import { Request, Response, NextFunction } from "express";

export const check = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		return res.send({
			name: process.env.MICROSERVICE_NAME,
		});
	} catch (error) {
		return next({ error });
	}
};
