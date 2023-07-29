"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { Action } from "../../../digitalniweb-types/models/globalData.js";

const Action = db.define<Action>(
	"Action",
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

export default Action;
