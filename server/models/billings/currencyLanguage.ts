"use strict";

import { DataTypes } from "sequelize";

import db from "../index";

import { billings } from "../../../types/models/billings";
import CurrencyLanguage = billings.CurrencyLanguage;

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

export default CurrencyLanguage;
