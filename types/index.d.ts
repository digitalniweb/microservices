import { CreationAttributes } from "sequelize/types";

import { users } from "./models/users";
import LoginLog = users.LoginLog;

export type microservices = "users" | "websites" | "billings";

export type possibleRoles =
	| "superadmin"
	| "owner"
	| "admin"
	| "tenant"
	| "user";

export interface loginAttempt extends CreationAttributes<LoginLog> {}
