import appCache from "./appCache";
import microserviceCall from "./microserviceCall";

import { Request } from "express";
import {
	authorizationListType,
	authorizationMap,
} from "../../types/authorization";

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
				if (!authorizationMap[property][object.type])
					authorizationMap[property][object.type] = {};
				authorizationMap[property][object.type][object.name] = object.id;
			});
		}

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