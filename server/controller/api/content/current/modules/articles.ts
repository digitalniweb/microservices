import { Request, Response, NextFunction } from "express";
import db from "../../../../../models/index.js";
import Article from "../../../../../models/content/article.js";
import WidgetContent from "../../../../../models/content/widgetContent.js";
import {
	getArticleQuery,
	saveArticleQuery,
} from "../../../../../../digitalniweb-types/apps/communication/modules/articles.js";
import { resourceIdsType } from "../../../../../../digitalniweb-types/apps/communication/index.js";
import { moduleResponse } from "../../../../../../digitalniweb-types/apps/communication/modules/index.js";
export const getArticle = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let { resourceIds, url } = req.query as getArticleQuery;
		if (typeof resourceIds === "string")
			resourceIds = JSON.parse(resourceIds) as resourceIdsType;

		let response = {} as moduleResponse<Article>;

		let article = await db.transaction(async (transaction) => {
			return await Article.findOne({
				where: {
					languageId: resourceIds.languageId,
					websiteId: resourceIds.websiteId,
					websitesMsId: resourceIds.websitesMsId,
					url,
				},
				transaction,
			});
		});

		if (!article) return res.send(null);
		response.moduleInfo = article;

		let widgetContents = await db.transaction(async (transaction) => {
			return await WidgetContent.findAll({
				where: {
					moduleRecordId: article.id,
					moduleId: resourceIds.moduleId,
					active: true,
				},
				transaction,
			});
		});
		response.widgetContents = widgetContents;

		return res.send(response);
	} catch (error: any) {
		return next({
			error,
			code: 500,
			message: "Couldn't get current Article",
		});
	}
};

/**
 * Saving new / editing existing menu (Article) including changing widgetContents and changing orders of menus (when menu gets reordered other menus must get reorered too)
 * @returns
 */
export const editArticle = async function (
	req: Request<{}, {}, {}, saveArticleQuery>,
	res: Response,
	next: NextFunction
) {
	try {
		// ! add transactions
		let query = req.query;
		let response = await db.transaction(async (transaction) => {
			let moduleResponse = {} as moduleResponse<Article>;
			let article: Article | null;
			if (query.menudata.id == 0) {
				// new menu / article
				let articleDataNew = (({ id, ...rest }) => rest)(
					query.menudata
				);

				article = await Article.create(articleDataNew, { transaction });
			} else {
				article = await Article.findOne({
					where: { id: query.menudata.id },
					transaction,
				});
				if (!article) return false;
			}
			if (query.widgetContent.deletedWCs.length) {
				await WidgetContent.destroy({
					where: { id: query.widgetContent.deletedWCs },
					transaction,
				});
			}
			if (query.widgetContent.editedWCs.length) {
				await Promise.all(
					query.widgetContent.editedWCs.map((wc) => {
						return WidgetContent.update(wc, {
							where: { id: wc.id },
							transaction,
						});
					})
				);
			}
			if (query.widgetContent.newWCs.length) {
				await WidgetContent.bulkCreate(
					query.widgetContent.newWCs.map((wc) => ({
						...wc,
						moduleRecordId: article.id,
					})),
					{ transaction }
				);
			}
			let widgetContents = await WidgetContent.findAll({
				where: { moduleRecordId: article.id },
				transaction,
			});

			if (query.newMenuUrls.length)
				await Promise.all(
					query.newMenuUrls.map((newUrl) => {
						return Article.update(
							{ url: newUrl.url },
							{
								where: { id: newUrl.id },
								transaction,
							}
						);
					})
				);

			moduleResponse.moduleInfo = article;
			moduleResponse.widgetContents = widgetContents;
			return moduleResponse;
		});

		return res.send(response);
	} catch (error: any) {
		return next({
			error,
			code: 500,
			message: "Couldn't create/edit Article",
		});
	}
};
