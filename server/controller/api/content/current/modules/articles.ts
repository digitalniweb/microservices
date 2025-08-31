// !!! zakomentovane bloky pomoci "//" je potreba predelat!!!
import type { Request, Response, NextFunction } from "express";
import db from "../../../../../models/index.js";
import Article from "../../../../../models/content/article.js";
import type { Article as ArticleType } from "../../../../../../digitalniweb-types/models/content.js";
import ArticleWidget from "../../../../../models/content/articleWidget.js";
import type { ArticleWidget as ArticleWidgetType } from "../../../../../../digitalniweb-types/models/content.js";
import type {
	deleteArticleRequestBody,
	editArticleRequestBody,
	getArticleQuery,
	orderDataObject,
	saveNewArticleRequestBody,
} from "../../../../../../digitalniweb-types/apps/communication/modules/articles.js";
import type { resourceIdsType } from "../../../../../../digitalniweb-types/apps/communication/index.js";
import { Op, type InferAttributes } from "sequelize";
import WidgetText from "../../../../../models/content/widgetText.js";
import WidgetBanner from "../../../../../models/content/widgetBanner.js";
export const getArticle = async function (req: Request, res: Response) {
	let { resourceIds, url } = req.query as getArticleQuery;
	if (typeof resourceIds === "string")
		resourceIds = JSON.parse(resourceIds) as resourceIdsType;

	let article = await db.transaction(async (transaction) => {
		return await Article.findOne({
			where: {
				languageId: resourceIds.languageId,
				websiteId: resourceIds.websiteId,
				websitesMsId: resourceIds.websitesMsId,
				url,
			},
			include: [
				// make this automatic for all associations
				{
					model: ArticleWidget,
					where: { active: true },
					paranoid: true,
					order: [["order", "ASC"]],
					include: [
						{
							model: WidgetText,
						},
						{
							model: WidgetBanner,
						},
					],
				},
			],
			transaction,
		});
	});

	res.send(article);

	/* let widgetContents = await db.transaction(async (transaction) => {
		return await ArticleWidget.findAll({
			where: {
				ArticleId: article.id,
			},
			order: [["order", "ASC"]],
			include: [
				{
					model: WidgetText,
				},
				{
					model: WidgetBanner,
				},
			],
			transaction,
		});
	});
	response.widgetContents = widgetContents; */
};

/**
 * Saving new menu (Article) including widgetContents and changing orders of menus (when menu gets reordered other menus must get reorered too)
 * @returns
 */
export const createArticle = async function (
	req: Request<{}, {}, saveNewArticleRequestBody, {}>,
	res: Response
) {
	let query = req.body;
	if (!query.menu) {
		res.send(false);
		return;
	}
	let response = await db.transaction(async (transaction) => {
		let article = await Article.create(query.menu, {
			transaction,
		});
		if (query.widgets?.new?.length) {
			await ArticleWidget.bulkCreate(
				query.widgets?.new.map((wc) => ({
					...wc,
					ArticleId: article.id,
				})),
				{ transaction }
			);
		}

		await Article.increment("order", {
			where: {
				languageId: article.languageId,
				websiteId: article.websiteId,
				websitesMsId: article.websitesMsId,
				parentId: article.parentId,
				order: {
					[Op.gte]: article.order,
				},
				id: {
					[Op.not]: article.id,
				},
			},
			transaction,
		});

		return article;
	});

	res.send(response);
};

/**
 * Saving edited existing menu (Article) including changing widgetContents and changing orders of menus (when menu gets reordered other menus must get reorered too) and urls
 * @returns
 */
export const editArticle = async function (
	req: Request<{}, {}, editArticleRequestBody, {}>,
	res: Response
) {
	let data = req.body;

	let response = await db.transaction(async (transaction) => {
		let article = await Article.findOne({
			where: { id: data.menu.id },
			transaction,
		});
		if (!article) return false;
		let previousLocation = {
			parentId: article.parentId,
			order: article.order,
		};
		if (data.menu)
			await article.update(data.menu, {
				transaction,
			});
		if (data.widgets?.deletedWCs?.length) {
			await ArticleWidget.destroy({
				where: { id: data.widgets?.deletedWCs },
				transaction,
			});
		}
		if (data.widgets?.editedWCs?.length) {
			await Promise.all(
				data.widgets?.editedWCs.map((wc) => {
					return ArticleWidget.update(wc, {
						where: { id: wc.id },
						transaction,
					});
				})
			);
		}
		if (data.widgets?.newWCs?.length) {
			await ArticleWidget.bulkCreate(
				data.widgets?.newWCs.map((wc) => ({
					...wc,
					ArticleId: data.menu.id,
				})),
				{ transaction }
			);
		}

		let currentLocationInfo: Pick<orderDataObject, "order" | "parentId"> = {
			order:
				data.menu?.data?.order !== undefined
					? data.menu.data.order
					: previousLocation.order,
			parentId:
				data.menu?.data?.parentId !== undefined
					? data.menu.data.parentId
					: previousLocation.parentId,
		};

		if (currentLocationInfo.parentId === previousLocation.parentId) {
			// change on same location
			if (currentLocationInfo.order !== previousLocation.order) {
				if (previousLocation.order < currentLocationInfo.order)
					await Article.decrement("order", {
						where: {
							languageId: article.languageId,
							websiteId: article.websiteId,
							websitesMsId: article.websitesMsId,
							parentId: article.parentId,
							order: {
								[Op.gt]: previousLocation.order,
								[Op.lte]: currentLocationInfo.order,
							},
							id: {
								[Op.not]: article.id,
							},
						},
						transaction,
					});
				else
					await Article.increment("order", {
						where: {
							languageId: article.languageId,
							websiteId: article.websiteId,
							websitesMsId: article.websitesMsId,
							parentId: article.parentId,
							order: {
								[Op.gte]: currentLocationInfo.order,
								[Op.lt]: previousLocation.order,
							},
							id: {
								[Op.not]: article.id,
							},
						},
						transaction,
					});
			}
		} else {
			// menu was put into another menu
			let previousMenu = Article.decrement("order", {
				where: {
					languageId: article.languageId,
					websiteId: article.websiteId,
					websitesMsId: article.websitesMsId,
					parentId: previousLocation.parentId,
					order: {
						[Op.gt]: previousLocation.order,
					},
					id: {
						[Op.not]: article.id,
					},
				},
				transaction,
			});
			let currentMenu = Article.increment("order", {
				where: {
					languageId: article.languageId,
					websiteId: article.websiteId,
					websitesMsId: article.websitesMsId,
					parentId: article.parentId,
					order: {
						[Op.gte]: currentLocationInfo.order,
					},
					id: {
						[Op.not]: article.id,
					},
				},
				transaction,
			});
			await Promise.all([previousMenu, currentMenu]);
		}

		if (data.menu.newMenuUrls?.length)
			await Promise.all(
				data.menu.newMenuUrls.map((newUrl) => {
					return Article.update(
						{ url: newUrl.url },
						{
							where: { id: newUrl.id },
							transaction,
						}
					);
				})
			);

		return article;
	});

	res.send(response);
};

export const deleteArticle = async function (
	req: Request<{}, {}, deleteArticleRequestBody, {}>,
	res: Response
) {
	let data = req.body;
	let response = await db.transaction(async (transaction) => {
		let article = await Article.findOne({
			where: { id: data.id },
			transaction,
		});
		if (!article) return null;
		await article.destroy();
		await Article.decrement("order", {
			where: {
				languageId: article.languageId,
				websiteId: article.websiteId,
				websitesMsId: article.websitesMsId,
				parentId: article.parentId,
				order: {
					[Op.gt]: article.order,
				},
			},
			transaction,
		});
		return true;
	});
	res.send(!!response);
};
