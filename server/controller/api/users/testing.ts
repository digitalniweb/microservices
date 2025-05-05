import type { Request, Response, NextFunction } from "express";

// import User from "../../../models/users/user.js";
// import Role from "../../../models/globalData/role.js";
// import Tenant from "../../../models/users/tenant.js";

// import { userAuthenticate } from "../../../../custom/helpers/users/userAuthenticate.js";

export const test = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	// try {
	throw { code: 403 };
	res.send({ message: "it works" });
	/* req.body.email = "admin@digitalniweb.cz";
		req.body.password = "123456789";
		let auth = await userAuthenticate(req, next);
		res.send(auth); */
	/* let role = await Role.findOne({
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

		 res.send(role); */
	//  res.send(await role?.Users[0]?.Tenant?.findUser());
	/* let role = await Role.findOne();
		let user = await role?.getUsers();

		 res.send(user); */
	/* let user = await User.findOne();
		let userRole = await user?.getRole();

		 res.send(userRole); */
	// } catch (error) {
	// 	next({ error, message: "aa" });
	// }

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
	// 					include: [{ model: models.ModulePageLanguage }],
	// 				},
	// 			],
	// 		});
	// 	}); */

	// 	res.send(website);
	// } catch (error) {
	//
	// }
};
export const testPost = async function (req: Request, res: Response) {
	res.send("test");
};
