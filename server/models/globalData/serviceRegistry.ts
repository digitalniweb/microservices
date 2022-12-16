"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { globalData } from "../../../types/models/globalData.js";
import ServiceRegistry = globalData.ServiceRegistry;

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
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);

export default ServiceRegistry;
