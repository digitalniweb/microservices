import { Request, Response } from "express";

export const test = async (req: Request, res: Response) => {
	res.send({ message: "it works" });
};
