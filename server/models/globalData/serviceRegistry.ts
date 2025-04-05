"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import type { ServiceRegistry as ServiceRegistryType } from "../../../digitalniweb-types/models/globalData.js";
import Microservice from "./microservice.js";

const ServiceRegistry = db.define<ServiceRegistryType>(
	"ServiceRegistry",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		host: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: "uniqueHostPort",
		},
		port: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: "uniqueHostPort",
		},
		uniqueName: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		MicroserviceId: {
			type: DataTypes.INTEGER,
			references: {
				model: Microservice.tableName,
				key: "id",
			},
		},
		apiKey: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);

ServiceRegistry.belongsTo(Microservice);
Microservice.hasMany(ServiceRegistry);

Microservice.belongsTo(ServiceRegistry, { as: "mainServiceRegistry" });
ServiceRegistry.hasOne(Microservice, { as: "mainServiceRegistry" });

export default ServiceRegistry;
