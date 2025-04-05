import db from "../../../../../models/index.js";

import type { Request, Response, NextFunction } from "express";
import User from "../../../../../models/users/user.js";
import { requestPagination } from "../../../../../../digitalniweb-custom/helpers/requestPagination.js";
import Tenant from "../../../../../models/users/tenant.js";
import type { IncludeOptions } from "sequelize";

export const registerAdmin = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		await db.transaction(async (transaction) => {
			let { email, password, nickname, role } = req.body.formdata;
			let insertData = {
				email,
				password,
				role,
				active: true,
				nickname: undefined,
			};
			if (nickname !== undefined) insertData.nickname = nickname;

			insertData.role = role;
			return await User.create({
				...insertData,
			});
		});
		res.send({ message: "Registration complete" });
	} catch (error: any) {
		// when validation or uniqueness in DB is broken
		// let errors = error.errors.reduce((accumulator, currentObject) => {
		// 	accumulator[currentObject.path] = currentObject.message;
		// 	return accumulator;
		// }, {});
		let errorMessage = "Something went wrong while register";
		// if (error?.errors && error?.errors[0]?.path === "email")
		// 	errorMessage = "This email address is taken.";
		next({ error, code: 500, message: errorMessage });
	}
};

export const allUsers = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { limit, sort, page, sortBy } = requestPagination(req.query);
		let users = await db.transaction(async (transaction) => {
			return await User.findAndCountAll({
				/* where: {
					"$Language.code$": res.locals.lang.code,
				}, */
				paranoid: true, // items with deletedAt set won't occur in search result
				offset: (page - 1) * limit,
				limit,
				order: [[sortBy, sort]],
				distinct: true, // so it doesn't count joined results
				//subQuery:false
				// include: [{ attributes: [], model: Language }],
				transaction,
			});
		});
		res.send(users);
	} catch (error) {
		next({ error, code: 500, message: "Couldn't load users." });
	}
};

export const findUser = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { id } = req.params;
		let user = await db.transaction(async (transaction) => {
			return await User.findOne({
				where: {
					id,
				},
				transaction,
			});
		});
		res.send(user);
	} catch (error) {
		next({ error, code: 500, message: "Couldn't get user." });
	}
};

export const findTenant = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { id } = req.params;
		let attributes = ["nickname", "email"];
		let user = await db.transaction(async (transaction) => {
			return await User.findOne({
				where: {
					id,
				},
				attributes,
				include: {
					model: Tenant,
					transaction,
				} as IncludeOptions,
				transaction,
			});
		});
		res.send(user);
	} catch (error) {
		next({ error, code: 500, message: "Couldn't get user." });
	}
};
