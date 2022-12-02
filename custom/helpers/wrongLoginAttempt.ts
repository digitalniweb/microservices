// import LoginLog from "./../../server/models/loginLog.js";
import sleep from "../functions/sleep.js";

import { Request, NextFunction } from "express";
import LoginLog from "../../server/models/users/loginLog.js";

export default async function wrongLoginAttempt(
	req: Request,
	next: NextFunction,
	loginAttempt: any,
	errorObject: any
) {
	try {
		loginAttempt.successful = 0;
		await LoginLog.create(loginAttempt);
		await sleep();
		return next({
			code: 401,
			message: errorObject.message,
			data: { ...errorObject },
		});
	} catch (error) {
		return next({
			error,
			code: 401,
			message: errorObject.message,
			data: { ...errorObject },
		});
	}
}
