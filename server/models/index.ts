import { Sequelize } from "sequelize";
import { Options } from "sequelize";

import configDB from "./../config/config.js";

const env: string = process.env.NODE_ENV || "development";

const config: Options = configDB[env as keyof typeof configDB];

let db: Sequelize = new Sequelize(
	config.database!,
	config.username!,
	config.password,
	config
);

export default db;
