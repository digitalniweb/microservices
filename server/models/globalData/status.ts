"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import type { Status as StatusType } from "../../../digitalniweb-types/models/globalData.js";

const Status = db.define<StatusType>(
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
