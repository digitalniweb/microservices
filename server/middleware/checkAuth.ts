// const models = require("../models/index");
import { Request, Response, NextFunction } from "express";
import {
	adminAuthorizationNames,
	userAuthorizationNames,
} from "../../digitalniweb-types/authorization";

/**
 * Checks authorization of API point
 * 'superadmin' can access everything
 * if requested role is 'admin' then 'owner' has permissions as well
 * @default ["admin"]
 */
const checkAuthorization = function (
	requiredRole: (adminAuthorizationNames | userAuthorizationNames)[] = [
		"admin",
	]
) {
	return async function (req: Request, res: Response, next: NextFunction) {
		try {
			if (res.locals?.userVerified?.role === "superadmin") return next();
			if (
				res.locals?.userVerified?.role === "owner" &&
				requiredRole.includes("admin")
			)
				return next();
			if (
				!res.locals?.userVerified ||
				!requiredRole.includes(
					res.locals?.userVerified?.role as
						| adminAuthorizationNames
						| userAuthorizationNames
				)
			) {
				throw "";
			}
			return next();
		} catch (error) {
			return next({
				error,
				code: 403,
				message: "Forbidden",
				type: "authorization",
			});
		}
	};
};
const checkRegisterServiceAuth = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const prefix = "Bearer ";
		const headerAuth = req.headers?.authorization;
		if (!headerAuth)
			throw {
				code: 403,
				message: "Forbidden",
			};
		if (!headerAuth.startsWith(prefix))
			throw {
				code: 403,
				message: "Forbidden",
			};
		const apiKey = headerAuth.slice(prefix.length);
		if (apiKey !== process.env.GLOBALDATA_REGISTRY_API_KEY)
			throw {
				code: 403,
				message: "Forbidden",
			};
		return next();
	} catch (error) {
		return next(error);
	}
};
export { checkAuthorization, checkRegisterServiceAuth };
