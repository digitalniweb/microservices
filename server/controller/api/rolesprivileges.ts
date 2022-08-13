import { Request, Response, NextFunction } from "express";
import Privilege from "../../models/users/privilege";
import Role from "../../models/users/role";

import { users } from "../../../types/models";
import RoleType = users.Role;
import PrivilegeType = users.Privilege;

import db from "./../../models/index";
import { CreationAttributes, WhereOptions } from "sequelize/types";

export const allList = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		// select: roles/privileges
		// type: user/admin
		const { select = "all", type = "all" } = req.query;
		let data = db.transaction(async (transaction) => {
			let data = [];
			let where: WhereOptions<RoleType> = {};
			if (type !== "all") where.type = type as string;
			if (select === "all" || select === "roles")
				data.push(
					Role.findAll({
						where,
						paranoid: true, // items with deletedAt set won't occur in search result
						transaction,
					})
				);
			if (select === "all" || select === "privileges")
				data.push(
					Privilege.findAll({
						where,
						paranoid: true, // items with deletedAt set won't occur in search result
						transaction,
					})
				);
			if (data.length === 0) return false;
			let loadedList: any = await Promise.all(data);
			let list = {} as any;
			if (select === "all") {
				list.roles = loadedList[0];
				list.privileges = loadedList[1];
			} else {
				list[select as string] = loadedList[0];
			}
			return list;
		});
		return res.send(data);
	} catch (error) {
		next({ error, code: 500, message: "Couldn't load users." });
	}
};
