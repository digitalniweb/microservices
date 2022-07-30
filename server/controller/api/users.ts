const models = require("../../models/index");
import db from "./../../models/index";
import User from "./../../models/user";
import isObjectEmpty from "./../../../custom/functions/isObjectEmpty";
import wrongLoginAttempt from "../../../custom/helpers/wrongLoginAttempt";
import { Request, Response, NextFunction } from "express";
import { requestPagination } from "../../../custom/helpers/requestPagination";
import { IncludeOptions } from "sequelize";

exports.allUsers = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { limit, sort, page, sortBy } = requestPagination(req.query);
		let users = await db.transaction(async (transaction) => {
			return await User.findAndCountAll({
				/* where: {
					"$Language.code$": req.lang.code,
				}, */
				paranoid: true, // items with deletedAt set won't occur in search result
				offset: (page - 1) * limit,
				limit,
				order: [[sortBy, sort]],
				distinct: true, // so it doesn't count joined results
				//subQuery:false
				// include: [{ attributes: [], model: Language }],
				transaction,
			});
		});
		return res.send(users);
	} catch (error) {
		next({ error, code: 500, message: "Couldn't load users." });
	}
};
/* 
exports.refreshtoken = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let user = await db.transaction(async (transaction) => {
			return await User.findOne({
				attributes: ["id", "nickname", "refreshTokenSalt"],
				where: {
					id: req.body.id,
				},
				include: [
					{ model: Role, transaction } as IncludeOptions,
					{
						model: Privilege,
						attributes: ["name"],
						transaction,
					} as IncludeOptions,
				],
				transaction,
			});
		});
		return res.send(user);
	} catch (error) {
		next({ error, code: 500, message: "Couldn't get refresh token user." });
	}
};
exports.authenticate = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const user = await User.authenticate(
			req.body.login,
			req.body.password,
			req
		);

		if (!user) {
			return wrongLoginAttempt(req, next, req.antispam.loginAttempt, {
				message: "neplatné přihlášení",
				loginAttemptsCount: req.antispam.loginAttemptsCount,
				maxLoginAttempts: req.antispam.maxLoginAttempts,
			});
		}

		let deleteAttributes = ["password", "deletedAt"];
		for (const property in user.dataValues) {
			if (deleteAttributes.includes(property)) delete user.dataValues[property];
		}

		await LoginLog.create(req.antispam.loginAttempt);
		return res.send(user);
	} catch (error) {
		next({ error, code: 500, message: "Couldn't authenticate user." });
	}
};

exports.getUser = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { id } = req.params;
		let user = await db.transaction(async (transaction) => {
			return await User.findOne({
				where: {
					id,
				},
				transaction,
			});
		});
		return res.send(user);
	} catch (error) {
		next({ error, code: 500, message: "Couldn't get user." });
	}
};

exports.getTenant = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { id } = req.params;
		let attributes = ["nickname", "email"];
		let user = await db.transaction(async (transaction) => {
			return await User.findOne({
				where: {
					id,
				},
				attributes,
				include: {
					model: Tenant,
					transaction,
				} as IncludeOptions,
				transaction,
			});
		});
		return res.send(user);
	} catch (error) {
		next({ error, code: 500, message: "Couldn't get user." });
	}
};

exports.editUserProfile = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let { formdata } = req.body;
		let { Tenant } = formdata;
		if (Tenant) delete formdata.Tenant;
		let id = req.userVerified.id;
		if (formdata.role !== undefined) {
			// only certain authorized users can change roles: owner, admin, superadmin
			// and they can assign only same or smaller level of authorization
			if (
				!["owner", "superadmin"].some((userRole) =>
					req.userVerified.roles.includes(userRole)
				) &&
				!(req.userVerified.roles.includes("admin") && true) // !!!!! instead of '&& true' should be priviliges check of creating new users with maximum of priviliges they have. The same is in registration.js register
			)
				throw {
					code: 403,
					message: "Insufficient authorization.",
					finalResponse: true,
				};
		}
		await db.transaction(async (transaction) => {
			let edits = [];
			if (!isObjectEmpty(formdata))
				edits.push(
					User.update(formdata, {
						where: { id },
						transaction,
					})
				);
			if (Tenant)
				edits.push(
					Tenant.update(Tenant, {
						where: { UserId: id },
						transaction,
					})
				);
			await Promise.all(edits);
		});
		return res.send("User data were edited.");
	} catch (error) {
		next({ error, code: 500, message: "Couldn't edit user." });
	}
};

exports.findUser = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const id = req.params.id;
	try {
		let user = await db.transaction(async (transaction) => {
			return await User.findOne({
				where: { id },
				paranoid: true, // items with deletedAt set won't occur in search result
			});
		});
		return res.send(user);
	} catch (error) {
		next({
			error,
			code: 500,
			message: "Something went wrong while finding user.",
		});
	}
};
// associations https://sequelize.org/master/manual/assocs.html
exports.register = async function (
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
		// 		RoleId: 4,
		// 		domainId: 1,
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
			let insertData = {
				email,
				password,
			};
			let userRole = "user";
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

			let usersRole = await Role.findOne({
				where: { name: userRole },
				transaction,
			});

			let result = await usersRole.createUser(
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
	} catch (error: Error) {
		
		// when validation or uniqueness in DB is broken
		// let errors = error.errors.reduce((accumulator, currentObject) => {
		// 	accumulator[currentObject.path] = currentObject.message;
		// 	return accumulator;
		// }, {});
		let errorMessage = "Something went wrong while register";
		if (error.errors && error.errors[0]?.path === "email")
			errorMessage = "This email address is taken.";
		next({ error, code: 500, message: errorMessage });
	}
};

exports.registerAdmin = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		// !!!!!!! not done!!!! need to add privileges and roles with privileges at most the requester has
		await db.transaction(async (transaction) => {
			let {
				email,
				password,
				nickname,
				role,
				privileges = [],
			} = req.body.formdata;
			let insertData = {
				email,
				password,
				role,
				active: true,
			};
			if (nickname !== undefined) insertData.nickname = nickname;

			if (role.some((userRole) => ["superadmin", "owner"].includes(userRole))) {
				throw {
					code: 401,
					message: "Unauthorized request. Roles are not permitted.",
					finalResponse: true,
				};
			}

			let intersectedPrivileges = [];
			// if 'admin' then check if he has privileges to manage users
			if (req.userVerified.roles.includes("admin")) {
				if (!req.userVerified.privileges.includes("users"))
					throw {
						code: 401,
						message: "Unauthorized request.",
						finalResponse: true,
					};
				intersectedPrivileges = req.userVerified.privileges.filter(
					(privilege) => privileges.includes(privilege)
				);
				if (intersectedPrivileges)
					throw {
						code: 401,
						message:
							"Unauthorized request. You can't assign these permissions to user.",
						finalResponse: true,
					};
			}
			insertData.role = role;
			return await User.create({
				...insertData,
			});
		});
		return res.send({ message: "Registration complete" });
	} catch (error: any) {
		
		// when validation or uniqueness in DB is broken
		// let errors = error.errors.reduce((accumulator, currentObject) => {
		// 	accumulator[currentObject.path] = currentObject.message;
		// 	return accumulator;
		// }, {});
		let errorMessage = "Something went wrong while register";
		if (error?.errors && error?.errors[0]?.path === "email")
			errorMessage = "This email address is taken.";
		next({ error, code: 500, message: errorMessage });
	}
};
 */
