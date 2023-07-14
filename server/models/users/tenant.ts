"use strict";
// const { customBELogger } = require("./../../customFunctions/logger");

import { DataTypes } from "sequelize";

import db from "./../index.js";

import { Tenant } from "../../../digitalniweb-types/models/users.js";

const Tenant = db.define<Tenant>(
	"Tenant",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		UserId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		academicDegree: {
			type: new DataTypes.STRING(10),
			validate: {
				len: [0, 10],
			},
		},
		firstName: {
			type: new DataTypes.STRING(30),
			allowNull: false,
			validate: {
				len: [2, 30],
			},
		},
		lastName: {
			type: new DataTypes.STRING(30),
			allowNull: false,
			validate: {
				len: [2, 30],
			},
		},
		telephone: {
			type: new DataTypes.STRING(20),
			allowNull: false,
			validate: {
				is: /^[+]?[\s0-9]*$/,
				len: [9, 20],
			},
		},
		countryId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		city: {
			type: new DataTypes.STRING(50),
			allowNull: false,
			validate: {
				len: [2, 50],
			},
		},
		zip: {
			type: new DataTypes.STRING(10),
			allowNull: false,
			validate: {
				len: [2, 10],
			},
		},
		streetAddress: {
			type: new DataTypes.STRING(50),
			allowNull: false,
			validate: {
				len: [2, 50],
			},
		},
		houseNumber: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				len: [1, 6],
			},
		},
		landRegistryNumber: {
			type: DataTypes.INTEGER,
			allowNull: true,
			validate: {
				len: [0, 6],
			},
		},
		company: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: 0,
		},
		companyName: {
			type: new DataTypes.STRING(100),
			allowNull: true,
			validate: {
				len: [0, 100],
			},
		},
		tin: {
			type: new DataTypes.STRING(15),
			allowNull: true,
			validate: {
				len: [0, 15],
			},
		},
		vatId: {
			type: new DataTypes.STRING(15),
			allowNull: true,
			validate: {
				len: [0, 15],
			},
		},
		subscribeNewsletters: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: 0,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);

export default Tenant;
