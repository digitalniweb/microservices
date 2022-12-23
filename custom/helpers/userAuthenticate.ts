import { hashString } from "../functions/hashString.js";
import User from "./../../server/models/users/user.js";
import UserPrivilege from "./../../server/models/users/userPrivilege.js";
import { customBELogger } from "./logger.js";

export async function userAuthenticate(login: string, password: string) {
	// !!! this returns all data including password and refreshSalt !!!
	// You need to decide in calling method what to do with these information. Remove some of them before sending to user (as in api/controller/users -> authenticate) etc.
	try {
		const user = await User.findOne({
			where: { email: login, active: 1 },
			paranoid: true,
			include: [
				{
					model: UserPrivilege,
				},
			],
		});

		if (user === null) return false;
		if (!(hashString(password) === user.password)) return false;
		return user;
	} catch (error) {
		customBELogger({
			error,
			code: 500,
			message: "User authentication failed",
		});
		return false;
	}
}
