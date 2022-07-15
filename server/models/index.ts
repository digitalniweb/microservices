import fs from "node:fs";
import path from "node:path";
import { Sequelize, DataTypes } from "sequelize";
import { Options } from "sequelize/types";

import configDB from "./../config/config";

const basename = path.basename(__filename);

const env: string = process.env.NODE_ENV || "development";

const config: Options = configDB[env as keyof typeof configDB];

let db: any = {};
let sequelize: Sequelize = new Sequelize(
	config.database!,
	config.username!,
	config.password,
	config
);

fs.readdirSync(__dirname)
	.filter((file) => {
		return (
			file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
		);
	})
	.forEach(async (file) => {
		let model = await import(path.join(__dirname, file));
		model = model.default(sequelize, DataTypes);

		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export = db;
