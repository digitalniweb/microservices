import type { Request, Response, NextFunction } from "express";
import db from "../../../models/index.js";

import Module from "../../../models/globalData/module.js";
import {
	getRequestGlobalDataModelArray,
	getRequestGlobalDataModelList,
} from "../../../../digitalniweb-custom/helpers/getGlobalData.js";
import ModulePageLanguage from "../../../models/globalData/modulePageLanguage.js";
import ModulePage from "../../../models/globalData/modulePage.js";
import type { Includeable } from "sequelize";
import Widget from "../../../models/globalData/widget.js";

export const getModulesList = async function (req: Request, res: Response) {
	let data = await getRequestGlobalDataModelList(req, Module);

	res.send(data);
};

export const getArray = async function (req: Request, res: Response) {
	const responseArray = await getRequestGlobalDataModelArray(req, Module);
	res.send(responseArray);
};

export const getModulesIdsByNames = async function (
	req: Request,
	res: Response
) {
	let names = req.query.names as string[];
	let modules = await db.transaction(async (transaction) => {
		return await Module.findAll({
			where: {
				name: names,
			},
			transaction,
		});
	});
	const modulesIds = modules.map((module) => module.id);
	res.send(modulesIds);
};

export const getModulesByNames = async function (req: Request, res: Response) {
	let names = req.query.names as string[];
	let attributes = req.query.attributes as string[] | undefined;

	// in request this should be true or undefined
	let include = req.query.include as
		| boolean
		| undefined
		| Includeable
		| Includeable[];
	if (include === true) {
		include = [
			{
				model: ModulePage,
				include: [
					{
						model: ModulePageLanguage,
					},
				],
			},
		];
	} else {
		include = undefined;
	}
	if (!Array.isArray(names)) throw "Module names needs to be an array.";
	let modules = await db.transaction(async (transaction) => {
		return await Module.findAll({
			where: {
				name: names,
			},
			attributes,
			transaction,
			include,
		});
	});

	res.send(modules);
};

export const getModulesByIds = async function (req: Request, res: Response) {
	let ids = req.query.ids as string[] | number[];

	if (!Array.isArray(ids)) throw "Module IDs needs to be an array.";
	ids = ids.map(Number) as number[];
	if (ids.some((id) => isNaN(id))) throw "Module IDs needs to be numbers.";
	let modules = await db.transaction(async (transaction) => {
		return await Module.findAll({
			where: {
				id: ids,
			},
			transaction,
			include: [
				{
					model: ModulePage,
					include: [
						{
							model: ModulePageLanguage,
						},
					],
				},
				{
					model: Widget,
				},
			],
		});
	});

	res.send(modules);
};
