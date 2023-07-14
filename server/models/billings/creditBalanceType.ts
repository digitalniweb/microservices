"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { CreditBalanceType } from "../../../digitalniweb-types/models/billings.js";

const CreditBalanceType = db.define<CreditBalanceType>(
	"CreditBalanceType",
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
		description: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);

export default CreditBalanceType;
