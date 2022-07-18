import { Sequelize, ModelDefined } from "sequelize";
export interface dbModels {
	[key: string]: ModelDefined<Sequelize, typeof Sequelize>;
}
export interface dbConnection {
	sequelize?: Sequelize;
	Sequelize?: typeof Sequelize;
	models: dbModels;
}
