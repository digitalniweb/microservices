import appCache from "./appCache";
import microserviceCall from "./microserviceCall";

import { Request } from "express";
import {
	adminAuthorizationNames,
	authorizationListType,
	authorizationMap,
	userAuthorizationNames,
} from "../../types/authorization";
import { users } from "../../types/models/users";
import User = users.User;
import Privilege = users.Privilege;

type authorizationProperties = "roles" | "privileges";

async function getAuthorizationMap(req: Request) {
	// appCache.del("map", "authorizationMap");
	let authorizationMap = {} as authorizationMap;
	if (!appCache.has("map", "authorizationMap")) {
		let authorizationList: authorizationListType = await microserviceCall(req, {
			microservice: "users",
			path: "/api/rolesprivileges/list?select=all&type=all",
			method: "GET",
		});
		for (const property in authorizationList) {
			let currentAuthorizationType =
				authorizationList[property as keyof authorizationListType];
			currentAuthorizationType?.forEach((object) => {
				if (
					!authorizationMap[property][
						object.type as adminAuthorizationNames | userAuthorizationNames
					]
				)
					authorizationMap[property][object.type] = {} as User | Privilege;
				authorizationMap[property][object.type][object.name] = object.id;
			});
		}
		console.log(authorizationMap.privileges?.admin.redirects);
		console.log(authorizationMap.roles?.user.tenant);

		if (authorizationMap)
			appCache.set("map", JSON.stringify(authorizationMap), "authorizationMap");
	} else {
		let authorizationMapString = appCache.get("map", "authorizationMap");
		if (authorizationMapString)
			authorizationMap = JSON.parse(authorizationMapString);
	}

	return authorizationMap;
}

export default {
	getAuthorizationMap,
};
