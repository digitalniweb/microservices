import { hashString } from "../../../digitalniweb-custom/functions/hashString.js";
import User from "../../../server/models/users/user.js";
import UserModule from "../../../server/models/users/userModule.js";
import { log } from "../../../digitalniweb-custom/helpers/logger.js";
import { commonError } from "../../../digitalniweb-types/customHelpers/logger.js";

/**
 * You need to decide in calling method what to do with all the information including password etc.
 * Remove some of them before sending to user (as in api/controller/users -> authenticate) etc.
 * @param login
 * @param password
 * @returns returns all data including **password** and **refreshSalt**!
 */
export async function userAuthenticate(login: string, password: string) {
	try {
		const user = await User.findOne({
			where: { email: login, active: 1 },
			paranoid: true,
			include: [
				{
					model: UserModule,
				},
			],
		});

		if (user === null) return false;
		if (!(hashString(password + login) === user.password)) return false;
		return user;
	} catch (error) {
		log({
			error: error as commonError,
			type: "authentication",
			message: "User authentication failed",
			code: 401,
		});
		return false;
	}
}
