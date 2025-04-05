import type { Request, Response, NextFunction } from "express";
import db from "../../../../../models/index.js";
import Article from "../../../../../models/content/article.js";
import type { Article as ArticleType } from "../../../../../../digitalniweb-types/models/content.js";
import WidgetContent from "../../../../../models/content/widgetContent.js";
import type { WidgetContent as WidgetContentType } from "../../../../../../digitalniweb-types/models/content.js";
import type {
	deleteArticleRequestBody,
	editArticleRequestBody,
	getArticleQuery,
	orderDataObject,
	saveNewArticleRequestBody,
} from "../../../../../../digitalniweb-types/apps/communication/modules/articles.js";
import type { resourceIdsType } from "../../../../../../digitalniweb-types/apps/communication/index.js";
import type { moduleResponse } from "../../../../../../digitalniweb-types/apps/communication/modules/index.js";
import { Op } from "sequelize";
export const getArticle = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let { resourceIds, url } = req.query as getArticleQuery;
		if (typeof resourceIds === "string")
			resourceIds = JSON.parse(resourceIds) as resourceIdsType;

		let response = {} as moduleResponse<ArticleType>;

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

		if (!article) {
			res.send(null);
			return;
		}
		response.moduleInfo = article;

		let widgetContents = await db.transaction(async (transaction) => {
			return await WidgetContent.findAll({
				where: {
					moduleRecordId: article.id,
					moduleId: resourceIds.moduleId,
				},
				order: [["order", "ASC"]],
				transaction,
			});
		});
		response.widgetContents = widgetContents;

		res.send(response);
	} catch (error: any) {
		next({
			error,
			code: 500,
			message: "Couldn't get current Article",
		});
	}
};

/**
 * Saving new menu (Article) including widgetContents and changing orders of menus (when menu gets reordered other menus must get reorered too)
 * @returns
 */
export const createArticle = async function (
	req: Request<{}, {}, saveNewArticleRequestBody, {}>,
	res: Response,
	next: NextFunction
) {
	try {
		let query = req.body;
		if (!query.menu.data) {
			res.send(false);
			return;
		}
		let response = await db.transaction(async (transaction) => {
			let moduleResponse = {} as moduleResponse<ArticleType>;
			let article = await Article.create(query.menu.data, {
				transaction,
			});
			let widgetContents = [] as WidgetContentType[];
			if (query.widgetContent?.newWCs?.length) {
				await WidgetContent.bulkCreate(
					query.widgetContent?.newWCs.map((wc) => ({
						...wc,
						moduleRecordId: article.id,
					})),
					{ transaction }
				);
			}
			widgetContents = await WidgetContent.findAll({
				where: { moduleRecordId: article.id },
				order: [["order", "ASC"]],
				transaction,
			});

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

			moduleResponse.moduleInfo = article;
			moduleResponse.widgetContents = widgetContents;
			return moduleResponse;
		});

		res.send(response);
	} catch (error: any) {
		next({
			error,
			code: 500,
			message: "Couldn't create Article",
		});
	}
};

/**
 * Saving edited existing menu (Article) including changing widgetContents and changing orders of menus (when menu gets reordered other menus must get reorered too) and urls
 * @returns
 */
export const editArticle = async function (
	req: Request<{}, {}, editArticleRequestBody, {}>,
	res: Response,
	next: NextFunction
) {
	try {
		let data = req.body;

		let response = await db.transaction(async (transaction) => {
			let moduleResponse = {} as moduleResponse<ArticleType>;
			let article = await Article.findOne({
				where: { id: data.menu.id },
				transaction,
			});
			if (!article) return false;
			let previousLocation = {
				parentId: article.parentId,
				order: article.order,
			};
			if (data.menu.data)
				await article.update(data.menu.data, {
					transaction,
				});
			if (data.widgetContent?.deletedWCs?.length) {
				await WidgetContent.destroy({
					where: { id: data.widgetContent?.deletedWCs },
					transaction,
				});
			}
			if (data.widgetContent?.editedWCs?.length) {
				await Promise.all(
					data.widgetContent?.editedWCs.map((wc) => {
						return WidgetContent.update(wc, {
							where: { id: wc.id },
							transaction,
						});
					})
				);
			}
			if (data.widgetContent?.newWCs?.length) {
				await WidgetContent.bulkCreate(
					data.widgetContent?.newWCs.map((wc) => ({
						...wc,
						moduleRecordId: data.menu.id,
					})),
					{ transaction }
				);
			}
			let widgetContents = await WidgetContent.findAll({
				where: { moduleRecordId: data.menu.id },
				order: [["order", "ASC"]],
				transaction,
			});

			let currentLocationInfo: Pick<
				orderDataObject,
				"order" | "parentId"
			> = {
				order:
					data.menu.data?.order !== undefined
						? data.menu.data?.order
						: previousLocation.order,
				parentId:
					data.menu.data?.parentId !== undefined
						? data.menu.data?.parentId
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

			moduleResponse.moduleInfo = article;
			moduleResponse.widgetContents = widgetContents;
			return moduleResponse;
		});

		res.send(response);
	} catch (error: any) {
		next({
			error,
			code: 500,
			message: "Couldn't edit Article",
		});
	}
};

export const deleteArticle = async function (
	req: Request<{}, {}, deleteArticleRequestBody, {}>,
	res: Response,
	next: NextFunction
) {
	try {
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
	} catch (error: any) {
		next({
			error,
			code: 500,
			message: "Couldn't delete Article",
		});
	}
};
