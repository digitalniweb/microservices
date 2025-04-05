"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import type { Action as ActionType } from "../../../digitalniweb-types/models/globalData.js";

const Action = db.define<ActionType>(
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
