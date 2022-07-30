import User from "../models/user";
import UAParser, { IResult } from "ua-parser-js";
import validator from "validator";
import { Op, literal } from "sequelize";
import { Response, NextFunction } from "express";
import { CustomRequest } from "./../../types/server/customRequest";

import sleep from "../../custom/functions/sleep";

const wrongLoginAttempt =
	require("../../customFunctions/wrongLoginAttempt").default;

const loginAntispam = function () {
	return async (req: CustomRequest, res: Response, next: NextFunction) => {
		try {
			let userAgent = UAParser(req.headers["user-agent"]);
			if (
				req.body.password.length < 7 ||
				req.body.login == "" ||
				!validator.isEmail(req.body.login) ||
				!userAgent.browser.name ||
				!userAgent.engine.name ||
				!userAgent.os.name ||
				!req.body.ua ||
				userAgent.ua != req.body.ua
			) {
				// these are incorrect logins... these shouldn't be possible to execute via normal behaviour. Ignore these
				// send fake "blocked" message
				await sleep(); // default 1000ms
				return next({
					code: 401,
					message: "Wrong login.",
				});
			}
			let order = [
				literal("`Blacklist`.`blockedTill` IS NULL DESC"),
				["blockedTill", "DESC"],
			];
			let limit = 3; // limit I let same IP address perform an attack - I want to still remain the IP whitelisted till there is 'limit' confirmed attacks from multiple sources (changing user agent or some other shananigans). If the atacker is noob I can let the IP whitelisted for others
			/* let blacklistedUser = await Blacklist.findOne({
				attributes: ["blockedTill", "reason"],
				where: {
					blocked: true,
					blockedTill: {
						[Op.or]: {
							[Op.gt]: new Date(),
							[Op.eq]: null,
						},
					},
					service: "login",
					type: "userMail",
					value: req.body.login,
				},
				order,
			});
			if (blacklistedUser) {
				return next({
					code: 401,
					message: "Your account was blocked.",
					data: {
						date: blacklistedUser.blockedTill,
						reason: blacklistedUser.reason,
					},
				});
			}
			let blacklistedIP = await Blacklist.findAll({
				attributes: ["blockedTill", "reason", "otherData"],
				where: {
					blocked: true,
					blockedTill: {
						[Op.or]: {
							[Op.gt]: new Date(),
							[Op.eq]: null,
						},
					},
					service: "login",
					type: "IP",
					value: req.ip,
				},
				order,
				limit,
			});

			if (
				blacklistedIP.some(
					(blacklist: Blacklist) =>
						blacklist.otherData.userAgent == userAgent.ua
				)
			) {
				await sleep();
				return next({
					code: 401,
					message: "Your IP address was blocked",
				});
			}
			if (blacklistedIP.length >= limit) {
				// if there is multiple black listed same IP records deny logging in to (unfortunately) all users / accounts on this IP
				// if there was only 1 intruder on the same IP (and he was stupid enough he wouldn't pass the userAgent test, thus the amount of same IP address in blacklist wouldn't exceed the limit) don't punish all
				await sleep();

				return next({
					code: 401,
					message: "Your IP address was blocked",
					data: {
						date: blacklistedIP[0].blockedTill,
						reason: blacklistedIP[0].reason,
					},
				});
			}
			type loginAttempt = {
				userLogin: string;
				UserId: number | null | undefined;
				ip: string;
				userAgent: IResult;
				successful: 1 | 0;
			};
			let loginAttempt: loginAttempt = {
				userLogin: req.body.login,
				UserId: null,
				ip: req.ip,
				userAgent,
				successful: 1,
			};

			let maxLoginAttempts = 4; // max failed login attempts for same login / account
			let bruteForceLoginAttempts = 8; // from now consider this an attack on one login / account
			let timeSpanMinutes = 10;
			let bruteForceIPLoginAttempts = (maxLoginAttempts * timeSpanMinutes) / 2; // from now consider this an attack from one IP on multiple accounts. Dividing number 2 is just arbitrary coeficient to lower the count so the result remains time times login count dependent. This means if there is 20 (account independent) bad logins in 10 minutes from one IP it is considered an attack.
			let bruteForceUAIPLoginAttempts =
				(maxLoginAttempts * timeSpanMinutes) / 4; // from one IP and same UserAgent, multiple accounts. Dividing number 4 is just arbitrary coeficient same as in bruteForceIPLoginAttempts but higher to lower the amount of attempts because we know attacker's user agent
			let bruteForceIPLoginAttemptsPerDay = 60; // from 1 IP per day

			let timeSpan = new Date();
			timeSpan.setMinutes(timeSpan.getMinutes() - timeSpanMinutes); // now - 10 minutes

			let timeSpanTooManyAttempts = new Date();
			timeSpanTooManyAttempts.setMinutes(
				timeSpanTooManyAttempts.getMinutes() + timeSpanMinutes
			); // now + 10 minutes

			let timeSpanDay = new Date();
			timeSpanDay.setHours(timeSpanDay.getHours() - 24); // now - 1 day

			let loginAttemptsCounts = [];
			// ip login count
			// loginAttemptsCounts[0] => IPLoginAttemptsCount
			loginAttemptsCounts.push(
				LoginLog.count({
					where: {
						ip: req.ip,
						successful: 0,
						createdAt: {
							[Op.gte]: timeSpan,
						},
					},
				})
			);

			// ip and ua count
			// loginAttemptsCounts[1] => UAIPLoginAttemptsCount
			loginAttemptsCounts.push(
				LoginLog.count({
					where: {
						ip: req.ip,
						successful: 0,
						"userAgent.ua": { [Op.eq]: userAgent.ua }, // because whole object comparison doesn't work
						createdAt: {
							[Op.gte]: timeSpan,
						},
					},
				})
			);

			// user / account login count
			// loginAttemptsCounts[2] => loginAttemptsCount
			loginAttemptsCounts.push(
				LoginLog.count({
					where: {
						userLogin: req.body.login,
						successful: 0,
						createdAt: {
							[Op.gte]: timeSpan,
						},
					},
				})
			);
			// ip login count
			// loginAttemptsCounts[3] => IPLoginAttemptsCountInDay
			loginAttemptsCounts.push(
				LoginLog.count({
					where: {
						ip: req.ip,
						successful: 0,
						createdAt: {
							[Op.gte]: timeSpanDay,
						},
					},
				})
			);

			loginAttemptsCounts = await Promise.all(loginAttemptsCounts);

			let [
				IPLoginAttemptsCount,
				UAIPLoginAttemptsCount,
				loginAttemptsCount,
				IPLoginAttemptsCountInDay,
			] = loginAttemptsCounts;
			loginAttemptsCount++; // because first time it is 0
			let bruteforcinglogin = loginAttemptsCount >= bruteForceLoginAttempts; // bruteforcing certain account
			let bruteforcinglogins =
				IPLoginAttemptsCount >= bruteForceIPLoginAttempts; // from 1 IP bruteforcing multiple accounts
			let bruteforcingualogins =
				UAIPLoginAttemptsCount >= bruteForceUAIPLoginAttempts; // from 1 IP bruteforcing multiple accounts
			let bruteforcingloginsperday =
				IPLoginAttemptsCountInDay >= bruteForceIPLoginAttemptsPerDay;
			if (
				bruteforcinglogin ||
				bruteforcinglogins ||
				bruteforcingualogins ||
				bruteforcingloginsperday
			) {
				// get notified - send mail?
				// blacklist IP
				let blockedTill = new Date();
				blockedTill.setHours(blockedTill.getHours() + 7 * 24);

				let reason = "bruteforcing logins";
				if (bruteforcinglogin) reason = "bruteforcing login";

				await Blacklist.create({
					service: "login",
					type: "IP",
					value: req.ip,
					reason,
					otherData: { userAgent: userAgent.ua },
					blockedTill,
				});
				await sleep();
				return next({
					code: 401,
					message: "Your IP address was blocked",
				});
			}
			if (loginAttemptsCount >= bruteForceLoginAttempts - 2) {
				return wrongLoginAttempt(req, next, loginAttempt, {
					message: "Another login attempts will cause IP address ban!",
					loginAttemptsCount,
					maxLoginAttempts,
					blockedTill: timeSpanTooManyAttempts,
				});
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
				return wrongLoginAttempt(req, next, loginAttempt, {
					message: `Too many login attempts!<br> You can't login for next ${timeSpanMinutes} minutes, wait and try to log in again after this time past.`,
					loginAttemptsCount,
					maxLoginAttempts,
					blockedTill: timeSpanTooManyAttempts,
				});
			}

			if (!existingUserId) {
				return wrongLoginAttempt(req, next, loginAttempt, {
					message: "Wrong login",
					loginAttemptsCount,
					maxLoginAttempts,
				});
			}

			req.antispam = {
				loginAttempt,
				loginAttemptsCount,
				maxLoginAttempts,
			}; */
			return next();
		} catch (error) {
			return next({
				error,
				code: 500,
				message: "Wrong login information",
			});
		}
	};
};

export { loginAntispam };
