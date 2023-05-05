import db from "../../../server/models/index.js";

import App from "../../../server/models/globalData/app.js";
import AppType from "../../../server/models/globalData/appType.js";

import Language from "../../../server/models/globalData/language.js";
import { appOptions } from "../../../digitalniweb-types/customFunctions/globalData.js";
import { microserviceCall } from "../../../digitalniweb-custom/helpers/remoteProcedureCall.js";
import { websites } from "../../../digitalniweb-types/models/websites.js";

export async function registerApp(
	options: appOptions
): Promise<boolean | void> {
	// !!! added App.websitesId -> add url and website to websites_ms and return this id to this 'app'
	try {
		console.log(options);

		await db.transaction(async (transaction) => {
			let appCount = await App.count({
				where: {
					uniqueName: options.uniqueName,
				},
				transaction,
			});

			if (appCount !== 0) return;

			let websiteInfo: websites.Website | null = await microserviceCall({
				name: "websites",
				path: "/api/getwebsiteinfo",
				data: {
					url: options.host,
				},
			});

			if (websiteInfo === null) {
				// create a new website and url in websites_ms
				websiteInfo = await microserviceCall({
					name: "websites",
					path: "/api/createwebsite",
					method: "POST",
					data: options,
				});
				if (websiteInfo === null) {
					throw new Error(
						"Could not create new website while creating App."
					);
				}
			}

			// get appType and app and couple them together
			let [appType] = await AppType.findOrCreate({
				where: {
					name: options.appType,
				},
				transaction,
			});

			let app = await App.findOne({
				where: {
					name: options.name,
				},
				transaction,
			});

			// create app with default language. If language doesn't exis then return
			if (!app) {
				let appLanguage = await Language.findOne({
					where: {
						code: options.language,
					},
				});
				if (!appLanguage) return;
				app = await App.create(
					{
						websiteId: websiteInfo.id,
						port: options.port,
						name: options.name,
						uniqueName: options.uniqueName,
						apiKey: options.apiKey,
						LanguageId: appLanguage.id,
						AppTypeId: appType.id,
					},
					{ transaction }
				);
				await app.setLanguages([appLanguage], { transaction });
			}

			await app.setAppType(appType, { transaction });

			// if appType (or app in that matter) ends with "-tenants / -host" add those its counterpart ("-host / -tenants")

			let endsWith = ["host", "tenants"];
			const lastName = endsWith.find((lastName) =>
				options.appType.endsWith(lastName)
			);
			if (lastName === undefined) return;

			let counterpartName = endsWith.find((word) => word != lastName);
			if (lastName === "tenants") {
				// if appType is "xxx-tenants" then try to assign this to app with appType of "xxx-host" if it's not assigned
				let parentalHostApp = await app.getParent();
				if (parentalHostApp) return;
				let appHostName =
					options.appType.slice(0, -lastName.length) +
					counterpartName;
				let hostApp = await App.findOne({
					where: {
						name: appHostName,
					},
					transaction,
				});
				if (hostApp) await app.setParent(hostApp);
			} else if (lastName === "host") {
				// if appType is "xxx-host" then try to assign this to app with appType of "xxx-tenants" if it's not assigned
				let filialTenantsApp = await app.getChild();
				if (filialTenantsApp) return;
				let newAppTenantsName =
					options.appType.slice(0, -lastName.length) +
					counterpartName;
				let tenantsApp = await App.findOne({
					where: {
						name: newAppTenantsName,
					},
					transaction,
				});
				if (tenantsApp) await app.setChild(tenantsApp);
			}
		});
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}