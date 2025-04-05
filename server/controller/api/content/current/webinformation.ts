import type { Request, Response, NextFunction } from "express";
import db from "../../../../models/index.js";
import WebInformation from "../../../../models/content/webInformation.js";
import WebInformationLanguage from "../../../../models/content/webInformationLanguage.js";

export const webinformationPatch = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let { data, id } = req.body;

		let success = await db.transaction(async (transaction) => {
			// even though the sequelize update method describes the returning value differently it returns [1] on changing anything and [0] on changing nothing
			return await WebInformation.update(data, {
				transaction,
				where: {
					id,
				},
			});
		});

		res.send(success);
	} catch (error: any) {
		next({
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
		if (!id || isNaN(id as any)) {
			res.send(null);
			return;
		}
		let websiteInfo = await db.transaction(async (transaction) => {
			return await WebInformation.findOne({
				transaction,
				where: {
					websiteId: id,
				},
				include: [{ model: WebInformationLanguage }],
			});
		});

		res.send(websiteInfo);
	} catch (error: any) {
		next({
			error,
			code: 500,
			message: "Couldn't get website information data",
		});
	}
};
