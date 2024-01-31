import { requestPagination } from "../../../../digitalniweb-custom/helpers/requestPagination.js";
import { CreationAttributes, Op, Transaction, WhereOperators } from "sequelize";
import { Request, Response, NextFunction } from "express";
import db from "../../../models/index.js";
import { Website as WebsiteType } from "../../../../digitalniweb-types/models/websites.js";
import Website from "../../../models/websites/website.js";
import Url from "../../../models/websites/url.js";
import { getMainServiceRegistryId } from "../../../../digitalniweb-custom/helpers/serviceRegistryCache.js";
import WebsiteLanguageMutation from "../../../models/websites/websiteLanguageMutation.js";
import { log } from "../../../../digitalniweb-custom/helpers/logger.js";

export const test = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
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
			if (!website)
				return next({ code: 404, message: "Website not found." });

			let url = await Url.findOne({ where: { id: 3 }, transaction });

			if (!url) return next({ code: 404, message: "Url not found." });
			await website.addAliases([url], { transaction });
		}); */
		return res.send("ok");
	} catch (error) {
		return next({ error, code: 500, message: "Couldn't get website data" });
	}
};

export const getWebsiteByUrl = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let url = req.params.url;
		if (typeof url !== "string") return res.send(null);

		let website = await db.transaction(async (transaction) => {
			return await getWebsite(url, transaction);
		});

		return res.send(website);
	} catch (error) {
		return next({
			error,
			code: 500,
			message: "Couldn't get current's website data",
		});
	}
};

async function getWebsite(
	url: string,
	transaction: Transaction,
	paranoid: boolean = true
) {
	try {
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
			],
		});
	} catch (error: any) {
		log({
			type: "functions",
			status: "error",
			error,
		});
		return false;
	}
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
	res: Response,
	next: NextFunction
) {
	const { userid = undefined } = req.query;
	let where = {} as {
		userId?: number;
	};
	if (userid) where.userId = parseInt(userid as string);
	try {
		let count = await db.transaction(async (transaction) => {
			return await Website.count({
				where,
				transaction,
			});
		});
		return res.send(String(count));
	} catch (error) {
		next({
			error,
			code: 500,
			message: "Couldn't get testing websites count.",
		});
	}
};

export const findTenantWebsites = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { limit, sort, page, sortBy, search } = requestPagination(
			req.query
		);
		let where = {
			userId: parseInt(req.query.userid as string),
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
		return res.send(result);
	} catch (error) {
		next({ error, code: 500, message: "Couldn't get tenant's websites." });
	}
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
	try {
		let testingWebsitesCount = await db.transaction(async (transaction) => {
			return await Website.count({
				where,
				transaction,
			});
		});
		let maxTestCount = 3;
		if (testingWebsitesCount >= maxTestCount)
			return next({
				code: 403,
				message:
					"You already have a maximum count of testing websites!",
				data: {
					maxTestCount,
				},
			});

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

		return res.send({
			uuid: newTenantWebsite.uuid,
			contentMsId: newTenantWebsite.contentMsId,
			websiteId: newTenantWebsite.id,
		});
	} catch (error) {
		next({
			error,
			code: 500,
			message: "Couldn't get testing websites count.",
		});
	}
};

export const createwebsite = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let websiteData: CreationAttributes<WebsiteType> = req.body.website;
		let websiteUrl: string = req.body.url;

		if (!websiteData.contentMsId) {
			let mainServiceRegistryId = await getMainServiceRegistryId(
				"content"
			);
			if (mainServiceRegistryId !== null)
				websiteData.contentMsId = mainServiceRegistryId;
		}
		// I don't want this everytime, only when website should have emails
		// if (!websiteData.emailsMsId) {
		// 	let mainServiceRegistryId = await getMainServiceRegistryId(
		// 		"emails"
		// 	);
		// 	if (mainServiceRegistryId !== null)
		// 		websiteData.emailsMsId = mainServiceRegistryId;
		// }

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

			let include: any[] = [];
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

		return res.send(result);
	} catch (error) {
		next({
			error,
			code: 500,
			message: "Couldn't create website.",
		});
	}
};

export const getWebsiteLanguageMutations = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	// only mutations of website, without main language (which I get with website information)
	try {
		let { url } = req.query;
		let WebsiteLanguageMutations = await db.transaction(
			async (transaction) => {
				/* return await Language.findAll({
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
			}); */
			}
		);
		return res.send(WebsiteLanguageMutations);
	} catch (error) {
		return next({
			error,
			code: 500,
			message: "Couldn't get app languages list.",
		});
	}
};
