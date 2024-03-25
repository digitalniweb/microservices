import { Request, Response, NextFunction } from "express";
import { Op, col, fn } from "sequelize";
import WebsiteModule from "../../../../models/websites/websiteModule.js";
export const getModulesIds = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let id = req.query.id as string;
		let modulesIds = "modulesIds";
		let idsStringInstance = await WebsiteModule.findOne({
			attributes: [[fn("GROUP_CONCAT", col("moduleId")), modulesIds]],
			where: {
				[Op.and]: [{ active: true }, { WebsiteId: id }],
			},
			paranoid: true,
		});
		let idsString = idsStringInstance?.get(modulesIds) as string;
		let ids: number[] = [];
		if (idsString) ids = idsString.split(",").map(Number);

		return res.send(ids);
	} catch (error: any) {
		return next({
			error,
			code: 500,
			message: "Couldn't get website's modules ids",
		});
	}
};
