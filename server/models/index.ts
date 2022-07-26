import { Sequelize } from "sequelize";
import { Options } from "sequelize/types";

import configDB from "./../config/config";

const env: string = process.env.NODE_ENV || "development";

const config: Options = configDB[env as keyof typeof configDB];

let db: Sequelize = new Sequelize(
	config.database!,
	config.username!,
	config.password,
	config
);

export default db;
