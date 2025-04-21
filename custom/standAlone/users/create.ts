#!/usr/bin/env node
// @ts-nocheck // <- this script uses typescript and compiled (to js) sequelize (from dist folder) as well so it is messy a bit therefore disable typescript check.
// we can use this in cmd as: "node --experimental-strip-types ./custom/standAlone/users/create.ts --ships=4 --distance=22"

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { QueryInterface } from "sequelize";
import type {
	CreationAttributes,
	InferAttributes,
	// IncludeOptions
} from "sequelize";

import type { Role as RoleType } from "../../../digitalniweb-types/models/globalData";

import type {
	// Tenant as TenantType,
	User as UserType,
} from "../../../digitalniweb-types/models/users";

// import Tenant from "../../models/users/tenant.js";
import User from "../../../dist/server/models/users/user.js";

import Tenant from "../../../dist/server/models/users/tenant.js";
import LoginLog from "../../../dist/server/models/users/loginLog.js";
import Blacklist from "../../../dist/server/models/users/blacklist.js";
import db from "../../../dist/server/models/index.js";

import type { microservices } from "../../../digitalniweb-types/index";

type args = Pick<
	InferAttributes<UserType>,
	"websiteId" | "websitesMsId" | "roleId" | "email" | "password"
>;
const argv = yargs(hideBin(process.argv)).argv as unknown as {
	ships: number;
	distance: number;
};

if (argv.ships > 3 && argv.distance < 53.5) {
	console.log("Plunder more riffiwobbles!");
} else {
	console.log("Retreat from the xupptumblers!");
}

const microservice: Array<microservices> = ["users"];

await db.transaction(async (transaction) => {
	if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
		return;
	try {
		let bls = await Blacklist.findAll({ transaction });
		console.log(bls);
	} catch (error) {
		console.log(error);
	}
});
