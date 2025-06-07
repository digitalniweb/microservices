import type { Request, Response } from "express";
import db from "../../../models/index.js";
import WebInformation from "../../../models/content/webInformation.js";
import WebInformationLanguage from "../../../models/content/webInformationLanguage.js";
import type { WebInformation as WebInformationType } from "../../../../digitalniweb-types/models/content.js";
import type { Includeable } from "sequelize";
export const getWebinformation = async function (req: Request, res: Response) {
	const { id } = req.params as {
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

export const createWebinformation = async function (
	req: Request,
	res: Response
) {
	let webInformation = req.body as WebInformationType;
	let include = undefined as Includeable[] | undefined;
	if (webInformation.WebInformationLanguages)
		include = [{ model: WebInformationLanguage }];
	let webInfo = await WebInformation.create(webInformation, {
		include,
	});

	res.json(webInfo);
};
