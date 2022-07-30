import LoginLog from "./../../server/models/loginLog";
import sleep from "../functions/sleep";

import { Request, NextFunction } from "express";

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
