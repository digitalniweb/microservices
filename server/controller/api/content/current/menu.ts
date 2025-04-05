import type { Request, Response, NextFunction } from "express";
import db from "../../../../models/index.js";
import Article from "../../../../models/content/article.js";
import type { Article as ArticleType } from "../../../../../digitalniweb-types/models/content.js";
import type {
	resourceIdsType,
	useApiCallQuery,
} from "../../../../../digitalniweb-types/apps/communication/index.js";
import type { InferAttributes } from "sequelize";
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
				order: [["order", "ASC"]],
				transaction,
			});
		});

		const data = menu.map((instance) => instance.toJSON());
		const treeMenu = buildTree<InferAttributes<ArticleType>>(data);

		res.send(treeMenu);
	} catch (error: any) {
		next({
			error,
			code: 500,
			message: "Couldn't get website's menu.",
		});
	}
};

export const getMenuAll = async function (
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
				},
				order: [["order", "ASC"]],
				transaction,
			});
		});
		const data = menu.map((instance) => instance.toJSON());
		const treeMenu = buildTree<InferAttributes<ArticleType>>(data);

		res.send(treeMenu);
	} catch (error: any) {
		next({
			error,
			code: 500,
			message: "Couldn't get website's menu.",
		});
	}
};
