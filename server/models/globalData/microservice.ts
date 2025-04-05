"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import type { Microservice as MicroserviceType } from "../../../digitalniweb-types/models/globalData.js";

const Microservice = db.define<MicroserviceType>(
	"Microservice",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		mainServiceRegistryId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);

export default Microservice;
