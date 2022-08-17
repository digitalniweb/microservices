"use strict";

import { DataTypes } from "sequelize";

import db from "../index";

import { websites } from "../../../types/models";
import WebsiteLanguageMutation = websites.WebsiteLanguageMutation;

const WebsiteLanguageMutation = db.define<WebsiteLanguageMutation>(
	"Website",
	{
		WebsiteId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		LanguageId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
	},
	{
		timestamps: false,
		paranoid: false,
	}
);

export default WebsiteLanguageMutation;
