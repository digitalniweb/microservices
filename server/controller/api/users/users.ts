import db from "../../../models/index.js";

import User from "../../../models/users/user.js";
import LoginLog from "../../../models/users/loginLog.js";

import type { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import type { CreationAttributes, Includeable } from "sequelize";

import type {
	User as UserType,
	WrongLoginLog as WrongLoginLogType,
} from "../../../../digitalniweb-types/models/users.js";
import type { LoginLog as LoginLogType } from "../../../../digitalniweb-types/models/users.js";

import UserModule from "../../../models/users/userModule.js";
import { getGlobalDataList } from "../../../../digitalniweb-custom/helpers/getGlobalData.js";
import { microserviceCall } from "../../../../digitalniweb-custom/helpers/remoteProcedureCall.js";
import type { UUID } from "node:crypto";
import type {
	loginInformation,
	wrongLoginError,
} from "../../../../digitalniweb-types/index.js";
import type { resourceIdsType } from "../../../../digitalniweb-types/apps/communication/index.js";
import { UAParser } from "ua-parser-js";
import validator from "validator";
import WrongLoginLog from "../../../models/users/wrongLoginLog.js";
import { hashString } from "../../../../digitalniweb-custom/functions/hashString.js";
import Tenant from "../../../models/users/tenant.js";
import { authRules } from "../../../../digitalniweb-custom/variables/authorization.js";
import {
	addMinutesToDate,
	subtractMinutesFromDate,
} from "../../../../digitalniweb-custom/functions/dateFunctions.js";
import type { registerUser } from "../../../../digitalniweb-types/users.js";

export const getById = async function (req: Request, res: Response) {
	if (!req.params.id) {
		res.send(null);
		return;
	}
	const user = await User.findOne({
		where: { id: req.params.id },
		paranoid: true,
		include: [
			{
				model: UserModule,
			},
		],
	});
	if (!user) {
		res.send(null);
		return;
	}

	res.send(await getStrippedUser(user));
};
type loginInfo = loginInformation & { resourceIds: resourceIdsType };
export const authenticate = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	let loginInfo = req.body as loginInfo;
	let userAgent = UAParser(loginInfo.ua);
	let timeSpan = subtractMinutesFromDate(
		new Date(),
		authRules.timeSpanMinutes
	);

	if (
		!loginInfo.ua ||
		loginInfo.password.length < authRules.minPasswordLength ||
		!loginInfo.email ||
		!validator.isEmail(loginInfo.email) ||
		!req.ip ||
		userAgent.ua != loginInfo.ua ||
		!userAgent.browser.name ||
		!userAgent.engine.name ||
		!userAgent.os.name
	) {
		let wrongLogin = await createWrongLoginLog(
			timeSpan,
			req.ip ?? "",
			loginInfo
		);
		sendLoginError(wrongLogin);
	}

	let includeUserInfo = [
		{
			model: UserModule,
		},
	] as Includeable[];
	if (loginInfo.type === "tenant")
		includeUserInfo.push({
			model: Tenant,
		});

	const user = await User.findOne({
		where: { email: loginInfo.email, active: 1 },
		paranoid: true,
		include: includeUserInfo,
	});

	if (user === null) {
		let wrongLogin = await createWrongLoginLog(
			timeSpan,
			req.ip ?? "",
			loginInfo
		);
		sendLoginError(wrongLogin);
	}
	console.log(timeSpan);

	let loginLog = await LoginLog.findOne({
		where: {
			createdAt: {
				[Op.gte]: timeSpan,
			},
			"$User.email$": loginInfo.email,
		},
		include: [User],
		order: [["createdAt", "DESC"]],
	});

	if (!loginLog)
		loginLog = LoginLog.build({
			ip: req.ip,
			successful: false,
			unsuccessfulCount: 0,
			websiteId: loginInfo.resourceIds.websiteId,
			websitesMsId: loginInfo.resourceIds.websitesMsId,
			UserId: user.id,
		});

	if (!(hashString(loginInfo.password + loginInfo.email) === user.password)) {
		loginLog.unsuccessfulCount++;
		await loginLog.save();
		sendLoginError(loginLog);
	}
	await loginLog.save();
	res.send(await getStrippedUser(user));
};
async function createWrongLoginLog(
	timeSpan: Date | undefined,
	ip: string,
	loginInfo: loginInfo
) {
	let wrongLoginLogCurrent = null;

	if (timeSpan !== undefined)
		wrongLoginLogCurrent = await WrongLoginLog.findOne({
			where: {
				createdAt: {
					[Op.gte]: timeSpan,
				},
				websiteId: loginInfo.resourceIds.websiteId,
				websitesMsId: loginInfo.resourceIds.websitesMsId,
				ip: ip,
				userLogin: loginInfo.email,
			},
		});
	if (wrongLoginLogCurrent === null)
		wrongLoginLogCurrent = WrongLoginLog.build({
			websiteId: loginInfo.resourceIds.websiteId,
			websitesMsId: loginInfo.resourceIds.websitesMsId,
			ip: ip,
			userLogin: loginInfo.email,
			unsuccessfulCount: 0,
		});
	wrongLoginLogCurrent.unsuccessfulCount++;
	await wrongLoginLogCurrent.save();
	return wrongLoginLogCurrent;
}
function sendLoginError(loginLog: WrongLoginLogType | LoginLogType): never {
	let errorData = {
		messageTranslate: "LoginErrorWrongLogin",
		maxLoginAttempts: authRules.maxAttempts,
		loginAttemptsCount: loginLog.unsuccessfulCount,
	} as wrongLoginError;
	if (loginLog.unsuccessfulCount >= authRules.maxAttempts) {
		errorData.messageTranslate = "LoginErrorTooManyAttempts";
		errorData.loginAttemptsCount = authRules.maxAttempts;
		errorData.blockedTill = addMinutesToDate(
			loginLog.createdAt!,
			authRules.timeSpanMinutes
		);
	}
	console.log(errorData);

	throw {
		statusCode: 401,
		message: "Login wasn't successful!",
		data: errorData,
	};
}

/**
 *
 * needs to be changed. At least the 'rolesIDs' part
 */
export const register = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
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
	let registeredUser = await db.transaction(async (transaction) => {
		let { resourceIds, user, userRole } = req.body as {
			resourceIds: resourceIdsType;
		} & registerUser;
		let insertData: CreationAttributes<UserType> = {
			email: user.email,
			password: user.password,
			nickname: user.nickname,
			Tenant: undefined,
			active: true,
			websiteId: resourceIds.websiteId,
			websitesMsId: resourceIds.websitesMsId,
		};

		let includeInfo = [];
		if (userRole === "tenant" && user.Tenant !== undefined) {
			userRole = "tenant";
			insertData.Tenant = user.Tenant;
			includeInfo.push({
				model: Tenant,
				transaction,
			});
		}

		let roles = await getGlobalDataList("roles");
		if (!roles) return false;
		let role = roles.find((r) => r.name === userRole);
		if (!role) return false;

		insertData.roleId = role.id;

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

	if (registeredUser === false) {
		throw new Error("Registration not complete");
	}
	res.send({ message: "Registration complete" });
};

async function getStrippedUser(user: UserType) {
	let strippedUser: Partial<UserType> = user.dataValues;
	let roles = getGlobalDataList("roles");
	let websiteUuid = microserviceCall<UUID>({
		name: "websites",
		id: user.websitesMsId,
		path: "/api/getuuid/" + user.websiteId,
	});
	let promises = await Promise.all([roles, websiteUuid]);

	if (!promises[0]) throw "Couldn't get roles from globalData.";
	if (!promises[1].data) throw "Couldn't get website's UUID.";

	let role = promises[0].find((r) => r.id === strippedUser.roleId);

	let modulesIds = strippedUser?.UserModules?.map((module) => module.id);
	if (role?.name === "owner") {
		modulesIds =
			(
				await microserviceCall<number[]>({
					name: "websites",
					id: strippedUser.websitesMsId,
					path: "/api/current/modulesIds",
					params: { websiteId: strippedUser.websiteId },
				})
			).data ?? [];
	}
	strippedUser.UserModulesIds = modulesIds;
	strippedUser.role = role;
	strippedUser.websiteUuid = promises[1].data;
	delete strippedUser.password;
	delete strippedUser.UserModules;
	return strippedUser;
}
