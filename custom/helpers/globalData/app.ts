import db from "../../../server/models/index.js";

import App from "../../../server/models/globalData/app.js";
import type { App as AppTsType } from "../../../digitalniweb-types/models/globalData.js";
import AppType from "../../../server/models/globalData/appType.js";

import Language from "../../../server/models/globalData/language.js";
import type { newAppOptions } from "../../../digitalniweb-types/customFunctions/globalData.js";
import type { Request } from "express";

export async function registerApp(
	options: newAppOptions,
	req: Request
): Promise<AppTsType | false> {
	let info = await db.transaction(async (transaction) => {
		let app = await App.findOne({
			where: {
				uniqueName: options.uniqueName,
			},
			transaction,
		});

		if (app) return app;

		// get appType and app and couple them together
		let [appType] = await AppType.findOrCreate({
			where: {
				name: options.appType,
			},
			transaction,
		});

		// create app with default language. If language doesn't exist then return
		if (!app) {
			let appLanguage = await Language.findOne({
				where: {
					code: options.language,
				},
				transaction,
			});
			if (!appLanguage) {
				throw new Error(`Language ${options.language} doesn't exist`);
			}

			app = await App.create(
				{
					port: options.port,
					name: options.name,
					uniqueName: options.uniqueName,
					apiKey: options.apiKey,
					LanguageId: appLanguage.id,
					AppTypeId: appType.id,
					host: options.host,
				},
				{ transaction }
			);
		}

		await app.setAppType(appType, { transaction });

		// if appType (or app in that matter) ends with "-tenants / -host" add those its counterpart ("-host / -tenants")
		let endsWith = ["host", "tenants"];
		const lastName = endsWith.find((postfix) =>
			options.appType.endsWith(postfix)
		);
		if (lastName !== undefined) {
			let counterpartName = endsWith.find((word) => word != lastName);
			if (lastName === "tenants") {
				// if appType is "xxx-tenants" then try to assign this to app with appType of "xxx-host" if it's not assigned
				let parentalHostApp = await app.getParent({ transaction });
				if (parentalHostApp) return app;
				let appHostName =
					options.appType.slice(0, -lastName.length) +
					counterpartName;
				let hostApp = await App.findOne({
					where: {
						name: appHostName,
					},
					transaction,
				});
				if (hostApp) await app.setParent(hostApp, { transaction });
			} else if (lastName === "host") {
				// if appType is "xxx-host" then try to assign this to app with appType of "xxx-tenants" if it's not assigned
				let filialTenantsApp = await app.getChild();
				if (filialTenantsApp) return app;
				let newAppTenantsName =
					options.appType.slice(0, -lastName.length) +
					counterpartName;
				let tenantsApp = await App.findOne({
					where: {
						name: newAppTenantsName,
					},
					transaction,
				});
				if (tenantsApp) await app.setChild(tenantsApp, { transaction });
			}
		}
		return app;
	});
	return info;
}
