import { CreationAttributes } from "sequelize/types";

import { users } from "./models";
import LoginLog = users.LoginLog;

export type microservices = "users" | "websites";

export type possibleRoles =
	| "superadmin"
	| "owner"
	| "admin"
	| "tenant"
	| "user";

export interface loginAttempt extends CreationAttributes<LoginLog> {}
