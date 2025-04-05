// import LoginLog from "./../../server/models/loginLog.js";
// import sleep from "../../digitalniweb-custom/functions/sleep.js";

import type { Request, NextFunction } from "express";
import LoginLog from "../../server/models/users/loginLog.js";
import type {
	loginAttempt,
	wrongLoginError,
} from "../../digitalniweb-types/index.js";

export default async function wrongLoginAttempt(
	req: Request,
	next: NextFunction,
	loginAttempt: loginAttempt,
	errorObject: wrongLoginError
) {
	try {
		loginAttempt.successful = false;

		await LoginLog.create(loginAttempt);
		// await sleep();
		next({
			type: "authentication",
			code: 401,
			message: errorObject.message,
			data: { ...errorObject },
		});
	} catch (error) {
		next({
			type: "authentication",
			error,
			code: 401,
			message: errorObject.message as string,
			data: { ...errorObject },
		});
	}
}
