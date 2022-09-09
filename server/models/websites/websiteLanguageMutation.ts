"use strict";

import { DataTypes } from "sequelize";

import db from "../index";

import { websites } from "../../../types/models/websites";
import WebsiteLanguageMutation = websites.WebsiteLanguageMutation;

const WebsiteLanguageMutation = db.define<WebsiteLanguageMutation>(
	"WebsiteLanguageMutation",
	{
		WebsiteId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		LanguageId: {
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
