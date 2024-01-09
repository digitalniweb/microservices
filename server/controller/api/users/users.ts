import db from "../../../models/index.js";

import User from "../../../models/users/user.js";
import LoginLog from "../../../models/users/loginLog.js";

import wrongLoginAttempt from "../../../../custom/helpers/wrongLoginAttempt.js";
import { Request, Response, NextFunction } from "express";
import { CreationAttributes } from "sequelize";

import { User as UserType } from "../../../../digitalniweb-types/models/users.js";

import { userAuthenticate } from "../../../../custom/helpers/users/userAuthenticate.js";
import {
	userAuthorizationNames,
	userRoles,
} from "../../../../digitalniweb-types/authorization/index.js";

export const authenticate = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const user = await userAuthenticate(req.body.email, req.body.password);

		if (!user) {
			return wrongLoginAttempt(
				req,
				next,
				res.locals?.antispam?.loginAttempt,
				{
					message: "neplatné přihlášení",
					loginAttemptsCount:
						res.locals?.antispam?.loginAttemptsCount,
					maxLoginAttempts: res.locals?.antispam?.maxLoginAttempts,
				}
			);
		}

		await LoginLog.create(res.locals?.antispam?.loginAttempt);
		return res.send(user);
	} catch (error) {
		next({ error, code: 500, message: "Couldn't authenticate user." });
	}
};

/**
 *
 * needs to be changed. At least the 'rolesIDs' part
 */
export const register = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		// this works, but I don't know if transactions work (maybe they do .save({transaction}))
		// let test = User.build(
		// 	{
		// 		email: "testtenant@test.cz",
		// 		nickname: "testtenant",
		// 		password: "123456789",
		// 		roleId: 4,
		// 		websiteId: 1,
		// 		Tenant: {
		// 			firstName: "test2",
		// 			lastName: "tenant2",
		// 			telephone: "123456789",
		// 			city: "Prostějov",
		// 			zip: "79604",
		// 			streetAddress: "Václava Špály",
		// 			houseNumber: 3,
		// 		},
		// 	},
		// 	{
		// 		include: [{ model: Tenant }],
		// 	}
		// );
		// let user = await test.save();

		// return res.send(user);
		await db.transaction(async (transaction) => {
			let { email, password, nickname, Tenant } = req.body.formdata;
			let insertData: CreationAttributes<UserType> = {
				email,
				password,
				nickname: undefined,
				Tenant: undefined,
				active: true,
			};

			let userRole: userAuthorizationNames = "user";
			let includeInfo = [];
			if (nickname !== undefined) insertData.nickname = nickname;
			if (Tenant !== undefined) {
				userRole = "tenant";
				insertData.Tenant = Tenant;
				includeInfo.push({
					model: Tenant,
					transaction,
				});
			}

			/* 
				!!! NEED TO BE CHANGED TO load roles from globalData, and get map
			*/
			let rolesIDs: userRoles = {
				user: 1,
				tenant: 2,
			};

			insertData.roleId = rolesIDs[userRole];

			let result = await User.create(
				{
					...insertData,
				},
				{
					include: includeInfo,
					transaction,
				}
			);

			return result;
		});
		return res.send({ message: "Registration complete" });
	} catch (error: any) {
		// when validation or uniqueness in DB is broken
		// let errors = error.errors.reduce((accumulator, currentObject) => {
		// 	accumulator[currentObject.path] = currentObject.message;
		// 	return accumulator;
		// }, {});
		let errorMessage = "Something went wrong while register";
		// if (error.errors && error.errors[0]?.path === "email")
		// 	errorMessage = "This email address is taken.";
		next({ error, code: 500, message: errorMessage });
	}
};
