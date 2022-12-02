"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { billings } from "../../../types/models/billings.js";
import CurrencyLanguage = billings.CurrencyLanguage;
import Currency from "./currency.js";

const CurrencyLanguage = db.define<CurrencyLanguage>(
	"CurrencyLanguage",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		CurrencyId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		languageId: {
			type: DataTypes.INTEGER,
			allowNull: false,
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

CurrencyLanguage.belongsTo(Currency);

export default CurrencyLanguage;
