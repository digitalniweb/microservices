import db from "../../../../../models/index.js";
import User from "../../../../../models/users/user.js";
import isObjectEmpty from "../../../../../../digitalniweb-custom/functions/isObjectEmpty.js";

import type { Request, Response, NextFunction } from "express";

export const refreshtoken = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	let user = await db.transaction(async (transaction) => {
		return await User.findOne({
			attributes: ["id", "nickname", "refreshTokenSalt", "userId"],
			where: {
				id: req.body.id,
			},
			/* include: [
					{
						model: UserPrivileges,
						attributes: ["name"],
						transaction,
					} as IncludeOptions,
				], */
			transaction,
		});
	});
	res.send(user);
};

export const editUserProfile = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	let { formdata } = req.body;
	let { Tenant } = formdata;
	if (Tenant) delete formdata.Tenant;
	let id = res.locals?.userVerified?.id;
	await db.transaction(async (transaction) => {
		let edits = [];
		if (!isObjectEmpty(formdata))
			edits.push(
				User.update(formdata, {
					where: { id },
					transaction,
				})
			);
		if (Tenant)
			edits.push(
				Tenant.update(Tenant, {
					where: { UserId: id },
					transaction,
				})
			);
		await Promise.all(edits);
	});
	res.send("User data were edited.");
};
