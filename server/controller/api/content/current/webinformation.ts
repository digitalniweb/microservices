import { Request, Response, NextFunction } from "express";
import db from "../../../../models/index.js";
import WebInformation from "../../../../models/content/webInformation.js";

export const webinformation = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { id, languageId } = req.query as {
			id: string;
			languageId: string;
		};
		if (!id || isNaN(id as any) || !languageId || isNaN(languageId as any))
			return res.send(null);
		let websiteInfo = await db.transaction(async (transaction) => {
			return await WebInformation.findOne({
				transaction,
				where: {
					websiteId: id,
					languageId,
				},
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
