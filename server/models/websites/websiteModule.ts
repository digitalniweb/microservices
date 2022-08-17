"use strict";

import { DataTypes } from "sequelize";

import db from "../index";

import { websites } from "../../../types/models";
import WebsiteModule = websites.WebsiteModule;

const WebsiteModule = db.define<WebsiteModule>(
	"Website",
	{
		WebsiteId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		ModuleId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
	},
	{
		timestamps: false,
		paranoid: false,
	}
);

export default WebsiteModule;
