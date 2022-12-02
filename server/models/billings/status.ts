"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { billings } from "../../../types/models/billings.js";
import Status = billings.Status;

const Status = db.define<Status>(
	"Status",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
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

export default Status;
