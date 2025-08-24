import { requestPagination } from "../../../../digitalniweb-custom/helpers/requestPagination.js";
import { Op, Transaction } from "sequelize";
import type {
	CreationAttributes,
	Includeable,
	WhereOperators,
} from "sequelize";
import type { Request, Response, NextFunction } from "express";
import db from "../../../models/index.js";
import type {
	WebsiteModule as WebsiteModuleType,
	Website as WebsiteType,
} from "../../../../digitalniweb-types/models/websites.js";
import Website from "../../../models/websites/website.js";
import Url from "../../../models/websites/url.js";
import { getMainServiceRegistryId } from "../../../../digitalniweb-custom/helpers/serviceRegistryCache.js";
import WebsiteLanguageMutation from "../../../models/websites/websiteLanguageMutation.js";
import WebsiteModule from "../../../models/websites/websiteModule.js";
import { getGlobalDataList } from "../../../../digitalniweb-custom/helpers/getGlobalData.js";
import type {
	addWebsiteModulesRequest,
	createWebsiteRequest,
} from "../../../../digitalniweb-types/apps/communication/websites/index.js";

export const test = async function (req: Request, res: Response) {
	/* let websiteData: CreationAttributes<WebsiteType> = {
			active: true,
			testingMode: true,
			paused: false,
			appId: 124,
			mainLanguageId: 1,
			contentMsId: 3,
			WebsiteLanguageMutations: [{ languageId: 2 }],
		};
		let result: WebsiteType = await db.transaction(async (transaction) => {
			if (!websiteData.WebsiteLanguageMutations)
				websiteData.WebsiteLanguageMutations = [];
			if (websiteData.languages) {
				websiteData.languages.forEach((lang) => {
					if (typeof lang === "number")
						websiteData.WebsiteLanguageMutations?.push({
							languageId: lang,
						});
					// !!! need to add if (typeof lang === "string") // type languages[]
				});
			}
			if (websiteData.mainLanguageId)
				websiteData.WebsiteLanguageMutations?.push({
					languageId: websiteData.mainLanguageId,
				});
			console.log("websiteData", websiteData);

			// let include: any[] = [];
			// if (websiteData.WebsiteLanguageMutations)
			// 	include = [WebsiteLanguageMutation];
			let website = await Website.create(websiteData, {
				include: [WebsiteLanguageMutation],
				transaction,
			});
			return website;
		});

		return res.send(result); */
	/* await db.transaction(async (transaction) => {
			let website = await Website.findOne({
				where: { id: 16 },
				transaction,
			});
			if (!website) {
				next({ code: 404, message: "Website not found." });
				return;
			}

			let url = await Url.findOne({ where: { id: 3 }, transaction });

			if (!url) {
				next({ code: 404, message: "Url not found." }); 
				return;
			}
			await website.addAliases([url], { transaction });
		}); */
	res.send("ok");
};

export const getWebsitesUuid = async function (req: Request, res: Response) {
	let id = req.params.id;

	// if undefined, null, empty or not number
	if (!id || isNaN(id as any)) {
		res.send(null);
		return;
	}

	let website = await db.transaction(async (transaction) => {
		return await Website.findOne({
			paranoid: true,
			attributes: ["uuid"],
			transaction,
			where: {
				id,
			},
		});
	});
	res.send(website?.uuid ?? null);
};

export const getWebsiteByUrl = async function (req: Request, res: Response) {
	let url = req.params.url;

	// if undefined, null, empty or coercible to number
	if (!url || !isNaN(url as any)) {
		res.send(null);
		return;
	}

	let website = await db.transaction(async (transaction) => {
		return await getWebsite(url, transaction);
	});

	res.json(website);
};

async function getWebsite(
	url: string,
	transaction: Transaction,
	paranoid: boolean = true
) {
	return await Website.findOne({
		paranoid: paranoid as boolean, // items with deletedAt set won't occur in search result
		transaction,
		include: [
			{
				model: Url,
				where: {
					"$MainUrl.url$": url,
				},
				attributes: [],
				as: "MainUrl",
			},
			{
				model: WebsiteLanguageMutation,
			},
			{
				model: WebsiteModule,
			},
		],
	});
}

/**
 * for 'testing' (= limited time) websites of user
 * !!! need to add condition to WHERE clause
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const testingWebsitesCount = async function (
	req: Request,
	res: Response
) {
	const { userid = undefined } = req.query;
	let where = {} as {
		userId?: number;
	};
	if (userid) where.userId = parseInt(userid as string);

	let count = await db.transaction(async (transaction) => {
		return await Website.count({
			where,
			transaction,
		});
	});
	res.send(String(count));
};

export const findTenantWebsites = async function (req: Request, res: Response) {
	const { limit, sort, page, sortBy, search } = requestPagination(req.query);
	let where = {
		userId: parseInt(req.params.userId as string),
	} as { userId: number; url: WhereOperators };
	if (search !== "")
		where["url"] = {
			[Op.like]: `%${search}%`,
		};
	let result = await db.transaction(async (transaction) => {
		return await Website.findAndCountAll({
			where,
			offset: (page - 1) * limit,
			limit,
			order: [[sortBy, sort]],
			paranoid: false,
			transaction,
		});
	});
	res.send(result);
};

export const addWebsiteModules = async function (req: Request, res: Response) {
	const { moduleIds, websiteId }: addWebsiteModulesRequest = req.body;
	if (!Array.isArray(moduleIds) || moduleIds.length === 0) {
		res.send(false);
		return;
	}
	let website = await Website.findOne({
		where: { id: websiteId },
		include: [{ model: WebsiteModule }],
	});
	if (!website) {
		res.send(false);
		return;
	}

	let modules = await getGlobalDataList("modules", "id", moduleIds);

	if (!Array.isArray(modules) || modules.length === 0) {
		res.send(false);
		return;
	}

	let websiteModules = [] as CreationAttributes<WebsiteModuleType>[];

	let todaysDate = new Date().getDate();
	modules.forEach((module) => {
		websiteModules.push({
			moduleId: module.id,
			active: true,
			WebsiteId: website.id,
			billingDay: module.creditsCost ? todaysDate : null,
		});
	});

	await WebsiteModule.bulkCreate(websiteModules);
	res.send(true);
};

export const registerTenant = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { userId, parentId } = req.body;
	let where = {} as {
		userId?: number;
		parentId?: number;
	};
	if (userId) where.userId = userId;
	if (parentId) where.parentId = parentId;

	let testingWebsitesCount = await db.transaction(async (transaction) => {
		return await Website.count({
			where,
			transaction,
		});
	});
	let maxTestCount = 3;
	if (testingWebsitesCount >= maxTestCount) {
		next({
			code: 403,
			message: "You already have a maximum count of testing websites!",
			data: {
				maxTestCount,
			},
		});
		return;
	}

	let newTenantWebsite = await db.transaction(async (transaction) => {
		return await Website.create(
			{
				userId: req.body.userId,
				testingMode: true,
				active: true,
				paused: false,
			},
			{
				transaction,
			}
		);
	});

	res.send({
		uuid: newTenantWebsite.uuid,
		contentMsId: newTenantWebsite.contentMsId,
		websiteId: newTenantWebsite.id,
	});
};

export const createwebsite = async function (req: Request, res: Response) {
	let { websiteData, websiteUrl, languages } =
		req.body as createWebsiteRequest;

	if (!websiteData.contentMsId) {
		let mainServiceRegistryContentId = await getMainServiceRegistryId(
			"content"
		);
		if (mainServiceRegistryContentId !== null)
			websiteData.contentMsId = mainServiceRegistryContentId;
	}

	if (!websiteData.usersMsId) {
		let mainServiceRegistryUsersId = await getMainServiceRegistryId(
			"users"
		);
		if (mainServiceRegistryUsersId !== null)
			websiteData.usersMsId = mainServiceRegistryUsersId;
	}

	// I don't want this everytime, only when website should have emails
	// if (!websiteData.emailsMsId) {
	// 	let mainServiceRegistryEmailsId = await getMainServiceRegistryId(
	// 		"emails"
	// 	);
	// 	if (mainServiceRegistryEmailsId !== null)
	// 		websiteData.emailsMsId = mainServiceRegistryEmailsId;
	// }

	let result: WebsiteType = await db.transaction(async (transaction) => {
		if (!websiteData.WebsiteLanguageMutations)
			websiteData.WebsiteLanguageMutations = [];
		let globalDataLanguages = await getGlobalDataList("languages");
		languages.forEach((lang) => {
			// if (typeof lang === "number")
			// 	websiteData.WebsiteLanguageMutations?.push({
			// 		languageId: lang,
			// 	});
			let languageId = globalDataLanguages?.find(
				(e) => e.code === lang
			)?.id;
			if (languageId)
				websiteData.WebsiteLanguageMutations?.push({
					languageId,
				});
		});
		if (websiteData.mainLanguageId)
			websiteData.WebsiteLanguageMutations?.push({
				languageId: websiteData.mainLanguageId,
			});

		let include: Includeable[] = [];
		if (websiteData.WebsiteLanguageMutations)
			include = [WebsiteLanguageMutation];
		let website = await Website.create(websiteData, {
			include,
			transaction,
		});
		let [url] = await Url.findOrCreate({
			where: {
				url: websiteUrl,
			},
			transaction,
		});

		let mainUrl = await website.setMainUrl(url, { transaction });
		website.MainUrlId = mainUrl.id;
		return website;
	});

	res.send(result);
};

export const getWebsiteLanguageMutations = async function (
	req: Request,
	res: Response
) {
	/* let { url } = req.query;
		let WebsiteLanguageMutations = await db.transaction(
			async (transaction) => {
				return await Language.findAll({
				transaction,
				where: {
					"$Websites.MainUrl.url$": url,
				},
				include: [
					{
						model: Website,
						attributes: [],
						include: [
							{
								model: Url,
								as: "MainUrl",
							},
						],
					},
				],
			});
			}
		);
		res.send(WebsiteLanguageMutations); */
	res.send("not implemented");
};
