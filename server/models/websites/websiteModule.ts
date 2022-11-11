"use strict";

import { DataTypes } from "sequelize";

import db from "../index";

import { websites } from "../../../types/models/websites";
import WebsiteModule = websites.WebsiteModule;

const WebsiteModule = db.define<WebsiteModule>(
	"WebsiteModule",
	{
		WebsiteId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		ModuleId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		billingDay: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 1,
				max: 31,
			},
		},
	},
	{
		timestamps: true,
		updatedAt: false,
		paranoid: true,
	}
);

export default WebsiteModule;
