"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { Microservice } from "../../../digitalniweb-types/models/globalData.js";

const Microservice = db.define<Microservice>(
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
