import type { Request, Response, NextFunction } from "express";

export const check = async function (req: Request, res: Response) {
	res.send({
		name: process.env.MICROSERVICE_NAME,
	});
};
