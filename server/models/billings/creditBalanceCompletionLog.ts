"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { CreditBalanceCompletionLog } from "../../../digitalniweb-types/models/billings.js";

const CreditBalanceCompletionLog = db.define<CreditBalanceCompletionLog>(
	"CreditBalanceCompletionLog",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		appId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		CreditBalanceTypeId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		completed: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	},
	{
		createdAt: true,
		updatedAt: false,
		paranoid: false, // deletedAt
	}
);

export default CreditBalanceCompletionLog;
