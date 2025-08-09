import type { Request, Response } from "express";
import db from "../../../../models/index.js";
import WebInformation from "../../../../models/content/webInformation.js";
import WebInformationLanguage from "../../../../models/content/webInformationLanguage.js";

export const webinformationPatch = async function (
	req: Request,
	res: Response
) {
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
};
export const webinformation = async function (req: Request, res: Response) {
	const { id } = req.query as {
		id: string;
	};

	if (!id || isNaN(id as any)) {
		res.json(null);
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

	res.json(websiteInfo);
};
