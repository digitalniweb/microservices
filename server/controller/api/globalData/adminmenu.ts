import type { Request, Response, NextFunction } from "express";
import db from "../../../models/index.js";

import AdminMenu from "../../../models/globalData/adminMenu.js";
import type { AdminMenu as AdminMenuType } from "../../../../digitalniweb-types/models/globalData.js";
import { getRequestGlobalDataModelList } from "../../../../digitalniweb-custom/helpers/getGlobalData.js";
import AdminMenuPageLanguage from "../../../models/globalData/adminMenuLanguage.js";
import AdminMenuLanguage from "../../../models/globalData/adminMenuLanguage.js";
import { buildTree } from "../../../../digitalniweb-custom/helpers/buildTree.js";
import { Op } from "sequelize";
import type { InferAttributes, WhereAttributeHash } from "sequelize";
import Role from "../../../models/globalData/role.js";
import RoleType from "../../../models/globalData/roleType.js";
import Module from "../../../models/globalData/module.js";
import type { Module as ModuleType } from "../../../../digitalniweb-types/models/globalData.js";

export const getAdminMenuList = async function (req: Request, res: Response) {
	let currentRoleName = req.query?.roleName as string;
	if (!["admin", "owner", "superadmin"].includes(currentRoleName))
		throw "There is no such role '" + currentRoleName + "'.";
	let roleNames = ["admin"];
	if (["owner", "superadmin"].includes(currentRoleName))
		roleNames.push("owner");
	if (currentRoleName === "superadmin") roleNames.push("superadmin");

	let where = {
		"$Role.name$": { [Op.or]: roleNames },
	} as WhereAttributeHash<AdminMenuType>;

	let moduleWhere = {} as WhereAttributeHash<ModuleType>;
	// show all admin menus for superadmin
	if (["admin", "owner"].includes(currentRoleName))
		moduleWhere.id = req.query.modules as [];

	let data = await getRequestGlobalDataModelList<AdminMenuType>(
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

	const treeMenu = buildTree<InferAttributes<AdminMenuType>>(plainData);
	res.send(treeMenu);
};

export const getAdminMenuByIds = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	let ids = req.query.ids as string[] | number[];

	if (!Array.isArray(ids)) throw "AdminMenu IDs needs to be an array.";
	ids = ids.map(Number) as number[];
	if (ids.some((id) => isNaN(id))) throw "AdminMenu IDs needs to be numbers.";
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

	res.send(adminmenu);
};
