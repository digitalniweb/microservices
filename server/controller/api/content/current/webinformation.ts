import { Request, Response, NextFunction } from "express";
import db from "../../../../models/index.js";
import WebInformation from "../../../../models/content/webInformation.js";
import WebInformationLanguage from "../../../../models/content/webInformationLanguage.js";

export const webinformationPatch = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let { data, websiteId } = req.body;
		let success = await db.transaction(async (transaction) => {
			return await WebInformation.update(data, {
				transaction,
				where: {
					websiteId,
				},
			});
		});

		return res.send(success);
	} catch (error: any) {
		return next({
			error,
			code: 500,
			message: "Couldn't patch website information data",
		});
	}
};
export const webinformation = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { id } = req.query as {
			id: string;
		};
		if (!id || isNaN(id as any)) return res.send(null);
		let websiteInfo = await db.transaction(async (transaction) => {
			return await WebInformation.findOne({
				transaction,
				where: {
					websiteId: id,
				},
				include: [{ model: WebInformationLanguage }],
			});
		});

		return res.send(websiteInfo);
	} catch (error: any) {
		return next({
			error,
			code: 500,
			message: "Couldn't get website information data",
		});
	}
};
