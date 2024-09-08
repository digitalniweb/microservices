import { NextFunction, Request, Response } from "express";
import db from "../../../models/index.js";

import AdminMenu from "../../../models/globalData/adminMenu.js";
import { getRequestGlobalDataModelList } from "../../../../digitalniweb-custom/helpers/getGlobalData.js";
import AdminMenuPageLanguage from "../../../models/globalData/adminMenuLanguage.js";
import AdminMenuLanguage from "../../../models/globalData/adminMenuLanguage.js";
import { buildTree } from "../../../../digitalniweb-custom/helpers/buildTree.js";
import { InferAttributes, Op, WhereAttributeHash } from "sequelize";
import Role from "../../../models/globalData/role.js";
import RoleType from "../../../models/globalData/roleType.js";
import Module from "../../../models/globalData/module.js";

export const getAdminMenuList = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let currentRoleName = req.query?.roleName as string;
		if (!["admin", "owner", "superadmin"].includes(currentRoleName))
			throw "There is no such role '" + currentRoleName + "'.";
		let roleNames = ["admin"];
		if (["owner", "superadmin"].includes(currentRoleName))
			roleNames.push("owner");
		if (currentRoleName === "superadmin") roleNames.push("superadmin");

		let where = {
			"$Role.name$": { [Op.or]: roleNames },
		} as WhereAttributeHash<AdminMenu>;

		let moduleWhere = {} as WhereAttributeHash<Module>;
		// show all admin menus for superadmin
		if (["admin", "owner"].includes(currentRoleName))
			moduleWhere.id = req.query.modules as [];

		let data = await getRequestGlobalDataModelList<AdminMenu>(
			req,
			AdminMenu,
			[
				{ model: Module, where: moduleWhere },
				{ model: AdminMenuLanguage },
				{ model: Role, include: [{ model: RoleType }] },
			],
			where,
			[["order", "ASC"]]
		);

		// get plain data from Sequelize instance
		const plainData = data.map((entity) => entity.get({ plain: true }));

		const treeMenu = buildTree<InferAttributes<AdminMenu>>(plainData);
		return res.send(treeMenu);
	} catch (error) {
		return next({
			error,
			code: 500,
			message: "Couldn't get adminmenu list.",
		});
	}
};

export const getAdminMenuByIds = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let ids = req.query.ids as string[] | number[];

		if (!Array.isArray(ids)) throw "AdminMenu IDs needs to be an array.";
		ids = ids.map(Number) as number[];
		if (ids.some((id) => isNaN(id)))
			throw "AdminMenu IDs needs to be numbers.";
		let adminmenu = await db.transaction(async (transaction) => {
			return await AdminMenu.findAll({
				where: {
					id: ids,
				},
				transaction,
				include: [
					{
						model: AdminMenuPageLanguage,
					},
				],
			});
		});

		return res.send(adminmenu);
	} catch (error) {
		return next({
			error,
			code: 500,
			message: "Couldn't get adminmenu list.",
		});
	}
};
