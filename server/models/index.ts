import fs from "node:fs";
import path from "node:path";
import { Sequelize, DataTypes, ModelDefined } from "sequelize";
import { Options } from "sequelize/types";

import configDB from "./../config/config";

const basename = path.basename(__filename);

const env: string = process.env.NODE_ENV || "development";

const config: Options = configDB[env as keyof typeof configDB];

import { dbConnection } from "../../types/server/models/db";

const db: dbConnection = {
	models: {},
};

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

		let model: ModelDefined<Sequelize, typeof Sequelize> = modelExport.default(
			sequelize,
			DataTypes
		);

		db.models[model.name] = model;

		db.models.Role?.hasOne(db.models.User);
		console.log(db.models);
	});

// https://sequelize.org/docs/v6/other-topics/typescript/

/* ModelDefined.prototype.associate = function (db) {};
Object.keys(db.models).forEach((modelName) => {
	if (db.models[modelName].associate) {
		db.models[modelName].associate(db);
	}
}); */

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const models = db.models;

export { db, models };
