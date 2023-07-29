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
const checkAuth = function (
	requiredRole: (adminAuthorizationNames | userAuthorizationNames)[] = [
		"admin",
	]
) {
	return async function (req: Request, res: Response, next: NextFunction) {
		try {
			if (req.userVerified?.role === "superadmin") return next();
			if (
				req.userVerified?.role === "owner" &&
				requiredRole.includes("admin")
			)
				return next();
			if (
				!requiredRole.includes(
					req.userVerified?.role as
						| adminAuthorizationNames
						| userAuthorizationNames
				)
			) {
				throw {
					code: 401,
					message:
						"Unauthorized request. Your role has insufficient permitions.",
					finalResponse: true,
				};
			}
			return next();
		} catch (error) {
			return next({
				error,
				code: "401",
				message: "Wrong authentication",
			});
		}
	};
};
export { checkAuth };
