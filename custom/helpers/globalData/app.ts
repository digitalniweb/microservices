import db from "../../../server/models/index.js";

import App from "../../../server/models/globalData/app.js";
import AppType from "../../../server/models/globalData/appType.js";

import { appInfoType } from "../../../digitalniweb-types/index.js";
import Language from "../../../server/models/globalData/language.js";

export async function registerApp(
	options: appInfoType
): Promise<boolean | void> {
	try {
		await db.transaction(async (transaction) => {
			let appCount = await App.count({
				where: {
					uniqueName: options.APP_UNIQUE_NAME,
				},
				transaction,
			});

			if (appCount !== 0) return;

			// get appType and app and couple them together
			let [appType] = await AppType.findOrCreate({
				where: {
					name: options.APP_TYPE,
				},
				transaction,
			});

			let app = await App.findOne({
				where: {
					name: options.APP_NAME,
				},
				transaction,
			});

			// create app with default language. If language doesn't exis then return
			if (!app) {
				let appLanguage = await Language.findOne({
					where: {
						name: options.DEFAULT_LANGUAGE,
					},
				});
				if (!appLanguage) return;
				app = await App.create(
					{
						host: options.HOST,
						port: options.PORT,
						name: options.APP_NAME,
						uniqueName: options.DEFAULT_LANGUAGE,
						apiKey: options.APP_API_KEY,
					},
					{ transaction }
				);
				app.setLanguage(appLanguage, { transaction });
				app.setLanguages([appLanguage], { transaction });
			}

			await app.setAppType(appType, { transaction });

			// if appType (or app in that matter) ends with "-tenants / -host" add those its counterpart ("-host / -tenants")

			let endsWith = ["host", "tenants"];
			const lastName = endsWith.find((lastName) =>
				options.APP_TYPE.endsWith(lastName)
			);
			if (lastName === undefined) return;

			let counterpartName = endsWith.find((word) => word != lastName);
			if (lastName === "tenants") {
				// if appType is "xxx-tenants" then try to assign this to app with appType of "xxx-host" if it's not assigned
				let hostApp: App = await app.getParent();
				if (hostApp) return;
				let newAppHostName =
					options.APP_TYPE.slice(0, -lastName.length) +
					"-" +
					counterpartName;
				let hostAppCreated = false;
				[hostApp, hostAppCreated] = await App.findOrCreate({
					where: {
						name: newAppHostName,
					},
					transaction,
				});
				await app.setParent(hostApp);
				if (hostAppCreated) {
					let newAppTypeName = options.APP_TYPE.replace(
						/-[^-]*$/,
						""
					);
					let newAppType = await AppType.create(
						{
							name: newAppTypeName,
						},
						{
							transaction,
						}
					);
					app.setAppType(newAppType, { transaction });
				}
			} else if (lastName === "host") {
				// if appType is "xxx-host" then try to assign this to app with appType of "xxx-tenants" if it's not assigned
				let tenantsApp: App = await app.getChild();
				if (tenantsApp) return;
				let newAppTenantsName =
					options.APP_TYPE.slice(0, -lastName.length) +
					"-" +
					counterpartName;
				let tenantsAppCreated = false;
				[tenantsApp, tenantsAppCreated] = await App.findOrCreate({
					where: {
						name: newAppTenantsName,
					},
					transaction,
				});
				await app.setChild(tenantsApp);
				if (tenantsAppCreated) {
					let newAppTypeName = options.APP_TYPE.replace(
						/-[^-]*$/,
						""
					);
					let newAppType = await AppType.create(
						{
							name: newAppTypeName,
						},
						{
							transaction,
						}
					);
					tenantsApp.setAppType(newAppType);
				}
			}
		});
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}
