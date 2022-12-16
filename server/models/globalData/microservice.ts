"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { globalData } from "../../../types/models/globalData.js";
import Microservice = globalData.Microservice;

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
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);

export default Microservice;
