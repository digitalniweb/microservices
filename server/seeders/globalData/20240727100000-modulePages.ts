import { QueryInterface } from "sequelize";

import { microservices } from "../../../digitalniweb-types/index.js";
// import Website from "../../models/globalData/website.js";
import Module from "../../models/globalData/module.js";
import Language from "../../models/globalData/language.js";
import ModulePage from "../../models/globalData/modulePage.js";
import ModulePageLanguage from "../../models/globalData/modulePageLanguage.js";
// import Url from "../../models/globalData/url.js";
// import { addDays } from "date-fns";
const microservice: Array<microservices> = ["globalData"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			try {
				// return; // this data is in '20220726700000-modules.ts' already

				// https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/
				let cs = await Language.findOne({ where: { code: "cs" } });
				let en = await Language.findOne({ where: { code: "en" } });

				let usersModule = await Module.findOne({
					where: {
						name: "users",
					},
					transaction,
				});

				let addModulePages = await ModulePage.bulkCreate(
					[
						{
							name: "Login",
							component: "WebPagesLogin",
							url: "login",
							ModulePageLanguages: [
								{
									LanguageId: cs?.id,
									url: "prihlaseni",
									name: "přihlásit",
									title: "Přihlášení uživatele",
									description: "Přihlášení uživatele",
									headline: "Přihlášení uživatele",
								},
								{
									LanguageId: en?.id,
									url: "login",
									name: "login",
									title: "User login",
									description: "User login",
									headline: "User login",
								},
							],
						},
						{
							name: "Logout",
							component: "WebPagesLogout",
							url: "logout",
							ModulePageLanguages: [
								{
									LanguageId: cs?.id,
									url: "odhlaseni",
									name: "odhlášení",
									title: "Odhlášení uživatele",
									description: "Odhlášení uživatele",
									headline: "Odhlášení uživatele",
								},
								{
									LanguageId: en?.id,
									url: "logout",
									name: "logout",
									title: "User logout",
									description: "User logout",
									headline: "User logout",
								},
							],
						},
						{
							name: "Register",
							component: "WebPagesRegister",
							url: "register",
							ModulePageLanguages: [
								{
									LanguageId: cs?.id,
									url: "registrace",
									name: "registrace",
									title: "Registrace uživatele",
									description: "Registrace uživatele",
									headline: "Registrace uživatele",
								},
								{
									LanguageId: en?.id,
									url: "register",
									name: "register",
									title: "User registration",
									description: "User registration",
									headline: "User registration",
								},
							],
						},
						{
							name: "Profile",
							component: "WebPagesProfile",
							url: "profile",
							ModulePageLanguages: [
								{
									LanguageId: cs?.id,
									url: "profil",
									name: "profil",
									title: "Profil uživatele",
									description: "Profil uživatele",
									headline: "Profil uživatele",
								},
								{
									LanguageId: en?.id,
									url: "profile",
									name: "profile",
									title: "User profile",
									description: "User profile",
									headline: "User profile",
								},
							],
						},
					],
					{ include: [{ model: ModulePageLanguage }], transaction }
				);

				await usersModule?.addModulePages(addModulePages, {
					transaction,
				});
			} catch (e) {
				console.log(e);
			}
		});
	},
	down: async (queryInterface: QueryInterface): Promise<void> => {
		await queryInterface.sequelize.transaction(async (transaction) => {
			try {
				await ModulePage.destroy({
					where: {
						name: ["Login", "Logout", "Register", "Profile"],
					},
					transaction,
				});
			} catch (e) {
				console.log(e);
			}
		});
	},
};
