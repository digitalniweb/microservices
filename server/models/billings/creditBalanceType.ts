"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import type { CreditBalanceType as CreditBalanceTypeType } from "../../../digitalniweb-types/models/billings.js";

const CreditBalanceType = db.define<CreditBalanceTypeType>(
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
