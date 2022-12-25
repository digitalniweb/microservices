import { randomString } from "./custom/functions/randomGenerator.js";
import {
	serviceRegistryList,
	registerService,
} from "./custom/helpers/globalData/serviceRegistry.js";
import { serviceOptions } from "./types/customFunctions/globalData.js";

let options: serviceOptions = {
	port: 3001,
	host: "srv2.digitalniweb.cz",
	uniqueName: randomString(10, false),
	microserviceName: "websites",
};

await registerService(options);
console.log(await serviceRegistryList());
