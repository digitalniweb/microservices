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
	},
	{
		timestamps: false,
		paranoid: false,
	}
);

export default WebsiteModule;
