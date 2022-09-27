import crypto from "node:crypto";
import Role from "./../../server/models/users/role";
import User from "./../../server/models/users/user";
import Privilege from "./../../server/models/users/privilege";
import { customBELogger } from "./logger";

export async function userAuthenticate(login: string, password: string) {
	// !!! this returns all data including password and refreshSalt !!!
	// You need to decide in calling method what to do with these information. Remove some of them before sending to user (as in api/controller/users -> authenticate) etc.
	try {
		const user = await User.findOne({
			where: { email: login, active: 1 },
			paranoid: true,
			include: [
				{
					attributes: ["name", "type"],
					model: Role,
				},
				{
					attributes: ["name"],
					model: Privilege,
				},
			],
		});

		if (user === null) return false;
		if (
			!(
				crypto
					.createHash("sha512")
					.update(password, "utf8")
					.digest("base64") === user.password
			)
		)
			return false;
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
