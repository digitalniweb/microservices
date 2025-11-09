import type { Request, Response } from "express";
import type {
	IncludeOptions,
	Model,
	ModelStatic,
	Transaction,
	WhereOptions,
} from "sequelize";
import { Op } from "sequelize";
import { getGlobalDataList } from "../../../../../../digitalniweb-custom/helpers/getGlobalData.js";
import { widgetsModelsArticle } from "../../../../../../digitalniweb-custom/variables/widgets.js";
import type { resourceIdsType } from "../../../../../../digitalniweb-types/apps/communication/index.js";
import type {
	deleteArticleRequestBody,
	editArticleRequestBody,
	getArticleQuery,
	orderDataObject,
	saveNewArticleRequestBody,
} from "../../../../../../digitalniweb-types/apps/communication/modules/articles.js";
import type {
	modulesWidgetsContent,
	widgetModels,
} from "../../../../../../digitalniweb-types/functionality/widgets.js";
import type { Article as ArticleType } from "../../../../../../digitalniweb-types/models/content.js";
import Article from "../../../../../models/content/article.js";

import ArticleWidget from "../../../../../models/content/articleWidget.js";
import db from "../../../../../models/index.js";
function getArticleWidgetAssociations(): IncludeOptions[] {
	return Object.values(ArticleWidget.associations).reduce(
		(
			result: { model: ModelStatic<Model>; required: false }[],
			association
		) => {
			if (
				widgetsModelsArticle.includes(
					association.target
						?.name as (typeof widgetsModelsArticle)[number]
				)
			)
				result.push({ model: association.target, required: false });
			return result;
		},
		[]
	);
}

export const getArticle = async function (req: Request, res: Response) {
	let { resourceIds, url } = req.query as getArticleQuery;
	if (typeof resourceIds === "string")
		resourceIds = JSON.parse(resourceIds) as resourceIdsType;

	let article = await getArticleWithIncludes(
		{
			languageId: resourceIds.languageId,
			websiteId: resourceIds.websiteId,
			websitesMsId: resourceIds.websitesMsId,
			url,
		},
		true
	);

	res.send(article);
};

/**
 * Module widgets (e.g. ArticleWidget) has only one widget - others are null. They are added in the includes when I add the includes automatically through model associations, so remove these.
 */
function sanitizeModuleWidgetFromUnusedModelAssociations(
	widgetContent: modulesWidgetsContent[] | undefined,
	modelNames: widgetModels[keyof widgetModels][] | undefined
) {
	if (!widgetContent || widgetContent.length === 0 || !modelNames) return;
	widgetContent?.forEach((wc) => {
		for (const wma of modelNames) {
			// typeof wma == "string" is because of typescript and how it treats tuples ([] as const)
			if (typeof wma == "string" && wc.dataValues[wma] === null) {
				delete wc.dataValues[wma];
			}
		}
	});
}

export const getArticleAdmin = async function (req: Request, res: Response) {
	let { resourceIds, url } = req.query as getArticleQuery;
	if (typeof resourceIds === "string")
		resourceIds = JSON.parse(resourceIds) as resourceIdsType;

	let article = await getArticleWithIncludes(
		{
			languageId: resourceIds.languageId,
			websiteId: resourceIds.websiteId,
			websitesMsId: resourceIds.websitesMsId,
			url,
		},
		true
	);

	res.send(article);
};

/**
 * Saving new menu (Article) including widgetContents and changing orders of menus (when menu gets reordered other menus must get reorered too)
 * @returns
 */
export const createArticle = async function (
	req: Request<{}, {}, saveNewArticleRequestBody, {}>,
	res: Response
) {
	let data = req.body;

	if (!data.menu) {
		res.send(false);
		return;
	}
	let response = await db.transaction(async (transaction) => {
		let article = await Article.create(data.menu, {
			transaction,
		});
		if (data.widgets?.new?.length) {
			const autoIncludes = getArticleWidgetAssociations();
			await ArticleWidget.bulkCreate(
				data.widgets?.new.map((wc) => ({
					...wc,
					ArticleId: article.id,
				})),
				{ transaction, include: autoIncludes }
			);
			let newArticle = await Article.findByPk(article.id, {
				transaction,
				include: {
					model: ArticleWidget,
					include: autoIncludes,
				},
			});
			if (newArticle) article = newArticle;
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
		if (data.menu.data)
			await article.update(data.menu.data, {
				transaction,
			});
		if (data.widgets?.deletedWCs?.length) {
			await ArticleWidget.destroy({
				where: { id: data.widgets?.deletedWCs },
				transaction,
			});
		}
		if (data.widgets?.editedWCs?.length) {
			// filter filters data but also creates shallow copy which we can use to update data
			let editedWCs = data.widgets?.editedWCs.filter(
				(wc) => typeof wc.id === "number"
			);
			let awIds = [] as number[];
			editedWCs.forEach((wc) => {
				awIds.push(wc.id as number);
			});
			if (awIds.length) {
				let articleWidgets = await ArticleWidget.findAll({
					where: {
						id: awIds,
					},
				});

				if (articleWidgets.length) {
					let widgets = await getGlobalDataList("widgets");
					for (let i = 0; i < articleWidgets.length; i++) {
						const aw = articleWidgets[i];
						const awEdits = editedWCs[i];
						let widget = widgets?.find((w) => aw.widgetId === w.id);

						const { id: idAw, ...updateFieldsAw } = awEdits;

						if (widget?.model) {
							let currentWidget = db.models[widget.model];
							let widgetContentData = awEdits[widget.model];
							if (widgetContentData) {
								const { id, ...updateFields } =
									widgetContentData;
								await currentWidget.update(updateFields, {
									where: {
										id: aw.widgetRowId,
									},
									transaction,
								});
							}

							if (widgetContentData?.name)
								delete updateFieldsAw[
									widgetContentData.name as widgetModels[number]
								];
						}

						await ArticleWidget.update(updateFieldsAw, {
							where: { id: idAw },
							transaction,
						});
					}
				}
			}
		}
		if (data.widgets?.newWCs?.length) {
			const autoIncludes = getArticleWidgetAssociations();
			await ArticleWidget.bulkCreate(
				data.widgets?.newWCs.map((wc) => ({
					...wc,
					ArticleId: data.menu.id,
				})),
				{ transaction, include: autoIncludes }
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

		article = await getArticleWithIncludes(
			{ id: data.menu.id },
			true,
			transaction
		);

		return article;
	});

	res.send(response);
};

async function getArticleWithIncludes(
	where: WhereOptions,
	articleWidgetParanoid: boolean,
	transaction?: Transaction
): Promise<ArticleType | null> {
	const autoIncludes = getArticleWidgetAssociations();
	let article = await Article.findOne({
		where,
		include: [
			{
				model: ArticleWidget,
				required: false,
				paranoid: articleWidgetParanoid,
				separate: true, // this makes ordering work
				order: [["order", "ASC"]],
				include: autoIncludes,
			},
		],
		transaction,
	});
	if (article)
		sanitizeModuleWidgetFromUnusedModelAssociations(
			article?.ArticleWidgets,
			widgetsModelsArticle
		);

	return article;
}

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
