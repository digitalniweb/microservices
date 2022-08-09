import { Request, Response, NextFunction } from "express";

import User from "../../models/users/user";
import Role from "../../models/users/role";
import Tenant from "../../models/users/tenant";

import { userAuthenticate } from "../../../custom/helpers/userAuthenticate";

export const test = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let auth = await userAuthenticate("admin@digitalniweb.cz", "123456789");
		return res.send(auth);

		let role = await Role.findOne({
			where: {
				id: 4,
			},
			include: [
				{
					model: User,
					include: [{ model: Tenant }],
				},
			],
		});
		// console.log(role?.Users[0]?.Tenant);

		//let tenant = await Tenant.findOne();

		return res.send(role);
		// return res.send(await role?.Users[0]?.Tenant?.getUser());
		/* let role = await Role.findOne();
		let user = await role?.getUsers();

		return res.send(user); */
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
