"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import type { WebsiteLanguageMutation as WebsiteLanguageMutationType } from "../../../digitalniweb-types/models/websites.js";

const WebsiteLanguageMutation = db.define<WebsiteLanguageMutationType>(
	"WebsiteLanguageMutation",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
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
