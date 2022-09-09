"use strict";

import { DataTypes } from "sequelize";

import db from "../index";

import { websites } from "../../../types/models/websites";
import Url = websites.Url;
import Website from "./website";

const Url = db.define<Url>(
	"Url",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		url: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				len: [4, 255],
			},
		},
		WebsiteId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: null,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);

export default Url;
