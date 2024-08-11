import { NextFunction, query, Request, Response } from "express";
import db from "../../../models/index.js";

import AdminMenu from "../../../models/globalData/adminMenu.js";
import { getRequestGlobalDataModelList } from "../../../../digitalniweb-custom/helpers/getGlobalData.js";
import AdminMenuPageLanguage from "../../../models/globalData/adminMenuLanguage.js";
import AdminMenuLanguage from "../../../models/globalData/adminMenuLanguage.js";
import { buildTree } from "../../../../digitalniweb-custom/helpers/buildTree.js";
import { InferAttributes, Op, WhereAttributeHash } from "sequelize";
import Role from "../../../models/globalData/role.js";
import RoleType from "../../../models/globalData/roleType.js";

export const getAdminMenuList = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let currentRoleId = parseInt(req.query?.roleId as string);
		if (!currentRoleId) throw "RoleId is mandatory.";
		let role = await Role.findOne({
			where: {
				"$RoleType.name$": "admin",
				id: currentRoleId,
			},
			attributes: ["id", "name"],
			include: {
				model: RoleType,
				attributes: [],
			},
		});
		if (!role) throw "There is no such role with this ID.";
		let currentRoleName = role.name;
		let roleNames = ["admin"];
		if (["owner", "superadmin"].includes(currentRoleName))
			roleNames.push("owner");
		if (currentRoleName === "superadmin") roleNames.push("superadmin");

		let where = {
			"$Role.RoleType.name$": { [Op.or]: roleNames },
		} as WhereAttributeHash<AdminMenu>;

		// show all admin menus for superadmin
		if (["admin", "owner"].includes(currentRoleName))
			where.ModuleId = req.query.modules as [];

		let data = await getRequestGlobalDataModelList<AdminMenu>(
			req,
			AdminMenu,
			[
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
