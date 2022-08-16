"use strict";

import { DataTypes } from "sequelize";

import db from "../index";

import { websites } from "../../../types/models";
import Url = websites.Url;
import Website from "./website";

const Url = db.define<Url>(
	"Url",
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
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

// I need to use other name than 'url' (I'll use 'alias'), because otherwise it conflicts on names and special methods ('.addUrl' etc.) don't work because of the two way bindings. Url <-> Website . I need to use '.addAlias' etc.
Website.hasMany(Url, { as: "Alias" });
Website.belongsTo(Url, { as: "MainUrl" });

export default Url;
