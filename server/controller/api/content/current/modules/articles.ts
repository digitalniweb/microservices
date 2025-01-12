import { Request, Response, NextFunction } from "express";
import db from "../../../../../models/index.js";
import Article from "../../../../../models/content/article.js";
import WidgetContent from "../../../../../models/content/widgetContent.js";
import {
	deleteArticleRequestBody,
	editArticleRequestBody,
	getArticleQuery,
	orderDataObject,
	saveNewArticleRequestBody,
} from "../../../../../../digitalniweb-types/apps/communication/modules/articles.js";
import { resourceIdsType } from "../../../../../../digitalniweb-types/apps/communication/index.js";
import { moduleResponse } from "../../../../../../digitalniweb-types/apps/communication/modules/index.js";
import { Op, WhereAttributeHashValue } from "sequelize";
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
				},
				order: [["order", "ASC"]],
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
		if (!query.menu.data) return res.send(false);
		let response = await db.transaction(async (transaction) => {
			let moduleResponse = {} as moduleResponse<Article>;
			let article = await Article.create(query.menu.data, {
				transaction,
			});
			let widgetContents = [] as WidgetContent[];
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

		return res.send(response);
	} catch (error: any) {
		return next({
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
			let moduleResponse = {} as moduleResponse<Article>;

			let article = await Article.findOne({
				where: { id: data.menu.id },
				transaction,
			});
			if (!article) return false;
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
					data.menu.data?.order ?? data.menu.previousLocation.order,
				parentId:
					data.menu.data?.parentId ??
					data.menu.previousLocation.parentId,
			};

			// parentId can be null -> root
			if (data.menu.data?.parentId !== undefined) {
				if (
					currentLocationInfo.parentId ===
					data.menu.previousLocation.parentId
				) {
					// change on same location
					if (
						currentLocationInfo.order !==
						data.menu.previousLocation.order
					) {
						let order = {} as WhereAttributeHashValue<number>;
						if (
							currentLocationInfo.order <
							data.menu.previousLocation.order
						)
							order = {
								[Op.gte]: currentLocationInfo.order,
								[Op.lt]: data.menu.previousLocation.order,
							};
						else
							order = {
								[Op.gt]: data.menu.previousLocation.order,
								[Op.lte]: currentLocationInfo.order,
							};
						await Article.increment("order", {
							where: {
								languageId: article.languageId,
								websiteId: article.websiteId,
								websitesMsId: article.websitesMsId,
								parentId: article.parentId,
								order,
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
							parentId: data.menu.previousLocation.parentId,
							order: {
								[Op.gt]: data.menu.previousLocation.order,
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

		return res.send(response);
	} catch (error: any) {
		return next({
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
		});
		return res.send(!!response);
	} catch (error: any) {
		return next({
			error,
			code: 500,
			message: "Couldn't delete Article",
		});
	}
};
