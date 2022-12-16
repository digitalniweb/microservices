"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { globalData } from "../../../types/models/globalData.js";
import ServiceRegistry = globalData.ServiceRegistry;
import Microservice from "./microservice.js";

const ServiceRegistry = db.define<ServiceRegistry>(
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
		},
		port: {
			type: DataTypes.NUMBER,
			allowNull: false,
		},
		MicroserviceId: {
			type: DataTypes.INTEGER,
			references: {
				model: Microservice.tableName,
				key: "id",
			},
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);

ServiceRegistry.belongsTo(Microservice);
Microservice.hasMany(ServiceRegistry);

export default ServiceRegistry;
