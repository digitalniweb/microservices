"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { billings } from "../../../digitalniweb-types/models/billings.js";
import Invoice = billings.Invoice;
import Currency from "../globalData/currency.js";
import Status from "./status.js";
import CreditBalanceLog from "./creditBalanceLog.js";

const Invoice = db.define<Invoice>(
	"Invoice",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		invoiceNumber: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		currencyId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		StatusId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		CreditBalanceLogId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		dueDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		timestamps: true, // createdAt, updatedAt
		paranoid: true, // deletedAt
	}
);

Invoice.belongsTo(Currency);
Invoice.belongsTo(Status);
Invoice.belongsTo(CreditBalanceLog);

export default Invoice;
