import { Sequelize } from "sequelize";
import type { Options } from "sequelize";

import configDB from "./../config/config.js";
import loadModels from "../../digitalniweb-custom/helpers/loadModels.js";

const env: string = process.env.NODE_ENV || "development";

const config: Options = configDB[env as keyof typeof configDB];

let db: Sequelize = new Sequelize(
	config.database!,
	config.username!,
	config.password,
	config
);
loadModels();
export default db;
