import { Request, Response, NextFunction } from "express";
import db from "../../../../models/index.js";
import Article from "../../../../models/content/article.js";
import {
	resourceIdsType,
	useApiCallQuery,
} from "../../../../../digitalniweb-types/apps/communication/index.js";
import { InferAttributes } from "sequelize";
import { buildTree } from "../../../../../digitalniweb-custom/helpers/buildTree.js";

export const getMenu = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let { resourceIds } = req.query as useApiCallQuery;
		if (typeof resourceIds === "string")
			resourceIds = JSON.parse(resourceIds) as resourceIdsType;

		let menu = await db.transaction(async (transaction) => {
			return await Article.findAll({
				where: {
					languageId: resourceIds.languageId,
					websiteId: resourceIds.websiteId,
					websitesMsId: resourceIds.websitesMsId,
					active: true,
				},
				raw: true,
				transaction,
			});
		});
		const treeMenu = buildTree<InferAttributes<Article>>(menu);

		return res.send(treeMenu);
	} catch (error: any) {
		return next({
			error,
			code: 500,
			message: "Couldn't get website's menu.",
		});
	}
};
