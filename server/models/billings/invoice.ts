"use strict";

import { DataTypes } from "sequelize";

import db from "../index";

import { billings } from "../../../types/models/billings";
import Invoice = billings.Invoice;
import Currency from "./currency";
import Status from "./status";
import CreditBalanceLog from "./creditBalanceLog";

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
		CurrencyId: {
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
