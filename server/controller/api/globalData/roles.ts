import type { Request, Response, NextFunction } from "express";
import db from "../../../models/index.js";

import Role from "../../../models/globalData/role.js";
import RoleType from "../../../models/globalData/roleType.js";

export const getRolesList = async function (req: Request, res: Response) {
	let roles = await db.transaction(async (transaction) => {
		return await Role.findAll({
			transaction,
			include: {
				model: RoleType,
			},
		});
	});

	res.send(roles);
};

export const getRolesByIds = async function (req: Request, res: Response) {
	let ids = req.query.ids as [];

	if (!Array.isArray(ids)) throw "Role IDs needs to be an array.";
	if (!ids) throw "You haven't specified role IDs.";
	if (ids.some((id) => isNaN(Number(id))))
		throw "Role IDs needs to be numbers.";
	let roles = await db.transaction(async (transaction) => {
		return await Role.findAll({
			where: {
				id: ids,
			},
			transaction,
		});
	});

	res.send(roles);
};
