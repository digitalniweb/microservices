import { requestPagination } from "../../../../custom/helpers/requestPagination.js";
import { Op } from "sequelize";
import { Request, Response, NextFunction } from "express";
import db from "../../../models/index.js";
import { websites } from "../../../../types/models/websites.js";
import WebsiteType = websites.Website;
import Website from "../../../models/websites/website.js";
import Url from "../../../models/websites/url.js";
import { randomString } from "../../../../custom/functions/randomGenerator.js";

export const getWebsiteInfo = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let { url, paranoid = true } = req.query;
		if (paranoid === "false" || paranoid === "0") paranoid = false; // if paranoid is anything else than string 'false' or '0' (because queries gives me always string) than it is true

		let website = await db.transaction(async (transaction) => {
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
		});

		return res.send(website);
	} catch (error) {
		console.log(error);

		return next({ error, code: 500, message: "Couldn't get website data" });
	}
};

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

export const getTenantWebsites = async function (
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
		};
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

		let uniqueName: string;
		let uniqueNameExists = {} as WebsiteType | null;
		do {
			uniqueName = randomString(10, false);
			uniqueNameExists = await Website.findOne({
				where: { uniqueName },
			});
		} while (uniqueNameExists !== null);
		let newTenantWebsite = await db.transaction(async (transaction) => {
			return await Website.create(
				{
					uniqueName,
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

		return res.send({ uniqueName, websiteId: newTenantWebsite.id });
	} catch (error) {
		next({
			error,
			code: 500,
			message: "Couldn't get testing websites count.",
		});
	}
};
