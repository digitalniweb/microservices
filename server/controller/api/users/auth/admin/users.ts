import db from "../../../../../models/index.js";

import type { Request, Response } from "express";
import User from "../../../../../models/users/user.js";
import { requestPagination } from "../../../../../../digitalniweb-custom/helpers/requestPagination.js";
import Tenant from "../../../../../models/users/tenant.js";
import type { IncludeOptions } from "sequelize";
import type { User as UserType } from "../../../../../../digitalniweb-types/models/users";
import Role from "../../../../../../server/models/globalData/role.js";

export const registerAdmin = async function (req: Request, res: Response) {
	await db.transaction(async (transaction) => {
		let { email, password, nickname, role } = req.body.formdata;
		let insertData = {
			email,
			password,
			role,
			active: true,
			nickname,
		} as UserType;

		insertData.role = role;
		return await User.create(
			{
				...insertData,
			},
			{ transaction, include: { model: Role } }
		);
	});
	res.send({ message: "Registration complete" });
};

export const allUsers = async function (req: Request, res: Response) {
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
};

export const findUser = async function (req: Request, res: Response) {
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
};

export const findTenant = async function (req: Request, res: Response) {
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
};
