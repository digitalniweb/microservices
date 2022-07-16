import fs from "node:fs";
import path from "node:path";
import { Sequelize, DataTypes, Model, ModelDefined } from "sequelize";
import { Options } from "sequelize/types";

import configDB from "./../config/config";

const basename = path.basename(__filename);

const env: string = process.env.NODE_ENV || "development";

const config: Options = configDB[env as keyof typeof configDB];

// type "Model" doesn't work, that's why it doesn't make really sense to type this
interface dbModels {
	sequelize?: Sequelize;
	Sequelize?: typeof Sequelize;
	[key: string]:
		| Sequelize
		| typeof Sequelize
		| undefined
		| ModelDefined<Sequelize, typeof Sequelize>;
}

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
		let modelExport = await import(path.join(__dirname, file));
		console.log(modelExport);

		let model: ModelDefined<Sequelize, typeof Sequelize> = modelExport.default(
			sequelize,
			DataTypes
		);

		db[model.name] = model;
	});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export = db;
