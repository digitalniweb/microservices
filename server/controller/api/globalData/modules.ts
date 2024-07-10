import { NextFunction, Request, Response } from "express";
import db from "../../../models/index.js";

import Module from "../../../models/globalData/module.js";
import {
	getRequestGlobalDataModelArray,
	getRequestGlobalDataModelList,
} from "../../../../digitalniweb-custom/helpers/getGlobalData.js";
import ModulePageLanguage from "../../../models/globalData/modulePageLanguage.js";
import ModulePage from "../../../models/globalData/modulePage.js";
import { Includeable, InferAttributes } from "sequelize";

export const getModulesList = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let data = await getRequestGlobalDataModelList(req, Module);

		return res.send(data);
	} catch (error) {
		return next({
			error,
			code: 500,
			message: "Couldn't get modules list.",
		});
	}
};

export const getArray = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const responseArray = await getRequestGlobalDataModelArray(req, Module);
		return res.send(responseArray);
	} catch (error) {
		return next({
			error,
			code: 500,
			message: "Couldn't get modules list.",
		});
	}
};

export const getModulesIdsByNames = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
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
		return res.send(modulesIds);
	} catch (error) {
		return next({
			error,
			code: 500,
			message: "Couldn't get modules list.",
		});
	}
};

export const getModulesByNames = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
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

		return res.send(modules);
	} catch (error) {
		return next({
			error,
			code: 500,
			message: "Couldn't get modules list.",
		});
	}
};

export const getModulesByIds = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let ids = req.query.ids as string[] | number[];

		if (!Array.isArray(ids)) throw "Module IDs needs to be an array.";
		ids = ids.map(Number) as number[];
		if (ids.some((id) => isNaN(id)))
			throw "Module IDs needs to be numbers.";
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
				],
			});
		});

		return res.send(modules);
	} catch (error) {
		return next({
			error,
			code: 500,
			message: "Couldn't get modules list.",
		});
	}
};
