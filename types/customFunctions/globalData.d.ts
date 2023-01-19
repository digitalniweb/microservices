import { microservices } from "../index.js";
import { globalData } from "../models/globalData.js";

export type microserviceRegistryInfo = {
	mainId: number;
	services: Array<globalData.ServiceRegistry>;
};

export type serviceRegistry = {
	[key in microservices]?: microserviceRegistryInfo;
};

import { Optional, CreationAttributes } from "sequelize";
import { globalData } from "../models/globalData.js";

export type serviceOptions = CreationAttributes<
	Optional<globalData.ServiceRegistry, "MicroserviceId">
> &
	Pick<globalData.Microservice, "name" | "mainServiceRegistryId">;
