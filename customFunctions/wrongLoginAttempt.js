import LoginLog from "../server/models/loginLog";
import sleep from "../helperFunctions/sleep";

export default async function wrongLoginAttempt(
	req,
	next,
	loginAttempt,
	errorObject
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
