"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { CreditBalanceModule } from "../../../digitalniweb-types/models/billings.js";
import CreditBalanceLog from "./creditBalanceLog.js";

const CreditBalanceModule = db.define<CreditBalanceModule>(
	"CreditBalanceModule",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		CreditBalanceLogId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		moduleId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);

CreditBalanceModule.belongsTo(CreditBalanceLog);

export default CreditBalanceModule;
