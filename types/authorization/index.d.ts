import { users } from "../models/users";
import RoleType = users.Role;
import PrivilegeType = users.Privilege;

export type authorizationListType = {
	roles?: RoleType[];
	privileges?: PrivilegeType[];
};

export type mainAuthorizationNames = "admin" | "user";
export type adminAuthorizationNames = "superadmin" | "admin" | "owner";
export type userAuthorizationNames = "user" | "tenant";

type adminPrivilegesNames =
	| "articles"
	| "menu"
	| "appereance"
	| "news"
	| "forms"
	| "users"
	| "redirects"
	| "webinformation"
	| "owner-information"
	| "url-information"
	| "analytics-marketing";

type adminPrivileges = {
	[key in adminPrivilegesNames]: number;
};

/* 
	authorizationMap = {
		roles: {
			admin: { superadmin: 1,... }, // roleName: roleId
			user: { tenant: 4,... }
		},
		privileges: {
			admin: { articles: 1,... }
			user: { privilegeName: privilegeId,... }
		}
	}
*/
export type authorizationMap = {
	// [key?: keyof authorizationListType]: {};
	roles?: {
		admin: {
			[key in adminAuthorizationNames]: number;
		};
		user: {
			[key in userAuthorizationNames]: number;
		};
	};
	privileges?: {
		admin: adminPrivileges;
		user: {};
	};
};
