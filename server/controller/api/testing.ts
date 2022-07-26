import { Request, Response, NextFunction } from "express";

import User from "../../models/user";
import Role from "../../models/role";

export const test = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let user = await Role.findOne({
			include: [
				{
					model: User,
				},
			],
		});
		return res.send(user);
	} catch (error) {
		return next(error);
	}

	return res.send({ message: "it works" });
	// try {
	// 	let website = await models.Website.findOne({
	// 		include: [
	// 			{
	// 				model: models.Url,
	// 				where: {
	// 					"$MainUrl.url$": "digitalniweblocalhost.cz",
	// 				},
	// 				attributes: [],
	// 				as: "MainUrl",
	// 			},
	// 			{
	// 				model: models.Module,
	// 				attributes: ["id", "name"],
	// 			},
	// 		],
	// 	});
	// 	/* let website = await models.sequelize.transaction(async (transaction) => {
	// 		return await models.Website.findOne({
	// 			where: {
	// 				"$MainUrl.url$": "digitalniweblocalhost.cz",
	// 			},
	// 			transaction,
	// 			include: [
	// 				{ model: models.Url, transaction, attributes: [], as: "MainUrl" },
	// 				{
	// 					model: models.Module,
	// 					transaction,
	// 					include: [{ model: models.ModulesPagesLanguage }],
	// 				},
	// 			],
	// 		});
	// 	}); */

	// 	return res.send(website);
	// } catch (error) {
	// 	return next({ error, code: 500, message: "Couldn't get website data" });
	// }
};
export const testPost = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		return res.send("a");
	} catch (error) {
		next({ error, code: 500, message: "Test error users ms" });
	}
};
