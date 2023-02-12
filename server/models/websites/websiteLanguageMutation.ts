"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { websites } from "../../../digitalniweb-types/models/websites.js";
import WebsiteLanguageMutation = websites.WebsiteLanguageMutation;

const WebsiteLanguageMutation = db.define<WebsiteLanguageMutation>(
	"WebsiteLanguageMutation",
	{
		WebsiteId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		languageId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		timestamps: false,
		paranoid: false,
	}
);

export default WebsiteLanguageMutation;
