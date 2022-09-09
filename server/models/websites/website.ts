"use strict";

import { DataTypes } from "sequelize";

import db from "../index";

import { websites } from "../../../types/models/websites";
import Website = websites.Website;

import Url from "./url";
import App from "./app";
import Language from "./language";
import Module from "./module";
import WebsiteModule from "./websiteModule";
import WebsiteLanguageMutation from "./websiteLanguageMutation";

const Website = db.define<Website>(
	"Website",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		uniqueName: {
			//  require('crypto').randomBytes(11).toString('base64').replace(/[^\w]/g, '').slice(0,14).padEnd(14, '0')
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isLength: 14,
			},
		},
		MainUrlId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		userId: {
			type: DataTypes.INTEGER,
		},
		AppId: {
			type: DataTypes.INTEGER,
		},
		MainLanguageId: {
			type: DataTypes.INTEGER,
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: 0,
		},
		testingMode: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: 0,
		},
		paused: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: 0,
		},
	},
	{
		timestamps: true,
		paranoid: true,
	}
);

Website.addHook(
	"afterUpdate",
	"createUrlSetAlias",
	async (website: Website) => {
		let changed = website.changed(); // array of changed properties

		if (changed && !changed.includes("MainUrlId")) return;

		let previousMainUrlId = website.previous().MainUrlId;
		if (previousMainUrlId !== undefined) return;

		let currentMainUrlId = website.getDataValue("MainUrlId");

		let addedMainUrl = await Url.findOne({
			where: { id: currentMainUrlId },
		});

		if (addedMainUrl) await website.setAlias([addedMainUrl]);
	}
);

// I need to use other name than 'url' (I'll use 'alias'), because otherwise it conflicts on names and special methods ('.addUrl' etc.) don't work because of the two way bindings. Url <-> Website . I need to use '.addAlias' etc.
Website.hasMany(Url, { as: "Alias" });

Website.belongsTo(Url, { as: "MainUrl" });

Website.belongsToMany(Module, {
	through: WebsiteModule.tableName,
});

Module.belongsToMany(Website, {
	through: WebsiteModule.tableName,
});

export default Website;
