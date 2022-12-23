"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { websites } from "../../../types/models/websites.js";
import Website = websites.Website;

import Url from "./url.js";
import Module from "../globalData/module.js";
import WebsiteModule from "./websiteModule.js";
import App from "./app.js";

const Website = db.define<Website>(
	"Website",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		uniqueName: {
			//  (await import("./dist/custom/functions/randomGenerator.js")).randomString(14, false)
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
			allowNull: true,
		},
		mainLanguageId: {
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
		// add server (hostName) - localhost / localhost2... - do Redis
		// rucne prenastavit kam aktualne nastavovat nove hostNames... - do Redis?
		// vyresit ze tohle je webistes... co websites-n atd.
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
	through: WebsiteModule,
});

Module.belongsToMany(Website, {
	through: WebsiteModule,
});

export default Website;
