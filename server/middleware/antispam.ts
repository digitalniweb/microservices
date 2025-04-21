/* // !!! put this to userAuthenticate

import User from "../models/users/user.js";
import { UAParser } from "ua-parser-js";
import validator from "validator";
import { Op, literal } from "sequelize";
import type { Order } from "sequelize";
import type { Request, Response, NextFunction } from "express";

import type {
	loginAttempt,
	loginInformation,
} from "../../digitalniweb-types/index.js";

// import sleep from "../../digitalniweb-custom/functions/sleep.js";
import LoginLog from "../models/users/loginLog.js";
import WrongLoginLog from "../models/users/wrongLoginLog.js";

import wrongLoginAttempt from "../../custom/helpers/wrongLoginAttempt.js";
import type { resourceIdsType } from "../../digitalniweb-types/apps/communication/index.js";

const loginAntispam = function () {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			let loginInfo = req.body as loginInformation & resourceIdsType;
			let userAgent = UAParser(loginInfo.ua);

			let maxLoginAttempts = 5; // max failed login attempts for same login / account
			let timeSpanMinutes = 10;
			let timeSpan = new Date();
			timeSpan.setMinutes(timeSpan.getMinutes() - timeSpanMinutes);

			if (
				!loginInfo.ua ||
				loginInfo.password.length < 7 ||
				!loginInfo.email ||
				!validator.isEmail(loginInfo.email) ||
				!req.ip ||
				userAgent.ua != loginInfo.ua ||
				!userAgent.browser.name ||
				!userAgent.engine.name ||
				!userAgent.os.name
			) {
				let wrongLoginLogCurrent = await WrongLoginLog.findOne({
					where: {
						createdAt: {
							[Op.gte]: timeSpan,
						},
						websiteId: loginInfo.websiteId,
						websitesMsId: loginInfo.websitesMsId,
						ip: req.ip,
						userLogin: loginInfo.email,
					},
				});
				if (wrongLoginLogCurrent === null)
					wrongLoginLogCurrent = WrongLoginLog.build({
						websiteId: loginInfo.websiteId,
						websitesMsId: loginInfo.websitesMsId,
						ip: req.ip,
						userLogin: loginInfo.email,
						count: 0,
					});
				wrongLoginLogCurrent.count++;
				await wrongLoginLogCurrent.save();
				next({
					type: "authentication",
					code: 401,
					message: "Login authentication has wrong information!",
				});
				return;
			}

			let loginAttempt: loginAttempt = {
				userLogin: loginInfo.email,
				UserId: null,
				ip: req.ip as string,
				userAgent,
				successful: true,
			};

			let timeSpanTooManyAttempts = new Date();
			timeSpanTooManyAttempts.setMinutes(
				timeSpanTooManyAttempts.getMinutes() + timeSpanMinutes
			); // now + 10 minutes

			let timeSpanDay = new Date();
			timeSpanDay.setHours(timeSpanDay.getHours() - 24); // now - 1 day

			if (loginAttemptsCount >= 5) {
				wrongLoginAttempt(req, next, loginAttempt, {
					message:
						"Another login attempts will cause IP address ban!",
					messageTranslate: "LoginErrorNextAttemptIPBan",
					loginAttemptsCount,
					maxLoginAttempts,
					blockedTill: timeSpanTooManyAttempts,
				});
				return;
			}

			let existingUserId = await User.findOne({
				attributes: ["id"],
				where: {
					email: loginAttempt.userLogin,
				},
				paranoid: true,
			});

			if (existingUserId) loginAttempt.UserId = existingUserId.id;

			if (loginAttemptsCount >= maxLoginAttempts) {
				wrongLoginAttempt(req, next, loginAttempt, {
					message: `Too many login attempts!`, //<br> You can't login for next ${timeSpanMinutes} minutes, wait and try to log in again after this time past.
					messageTranslate: "LoginErrorTooManyAttempts",
					loginAttemptsCount,
					maxLoginAttempts,
					timeSpanMinutes,
					blockedTill: timeSpanTooManyAttempts,
				});
				return;
			}

			if (!existingUserId) {
				wrongLoginAttempt(req, next, loginAttempt, {
					message: "Wrong login",
					messageTranslate: "LoginErrorWrongLogin",
					loginAttemptsCount,
					maxLoginAttempts,
				});
				return;
			}

			res.locals.antispam = {
				loginAttempt,
				loginAttemptsCount,
				maxLoginAttempts,
			};
			next();
		} catch (error) {
			next({
				error,
				code: 500,
				message: "Error while logging in.",
			});
		}
	};
};

export { loginAntispam };
 */
