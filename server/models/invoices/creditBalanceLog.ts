"use strict";

import { DataTypes } from "sequelize";

import db from "../index";

import { invoices } from "../../../types/models/invoices";
import CreditBalanceLog = invoices.CreditBalanceLog;

const CreditBalanceLog = db.define<CreditBalanceLog>(
	"CreditBalanceLog",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		websiteId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		creditDifference: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		CreditBalanceTypeId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		timestamps: true, // createdAt, updatedAt
		updatedAt: false,
		paranoid: false, // deletedAt
	}
);

export default CreditBalanceLog;
