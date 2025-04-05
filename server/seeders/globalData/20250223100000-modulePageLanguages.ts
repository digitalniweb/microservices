import { QueryInterface } from "sequelize";

import type { microservices } from "../../../digitalniweb-types/index.js";
// import Website from "../../models/globalData/website.js";
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
				return; // this data is in '20220726700000-modules.ts' and '20250223000000-modulesUpdateAddSaas' already.

				// https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/
				let cs = await Language.findOne({ where: { code: "cs" } });
				let en = await Language.findOne({ where: { code: "en" } });

				const photoGalleryPage = await ModulePage.findOne({
					where: { url: "photogallery" },
					transaction,
				});
				if (photoGalleryPage) {
					await photoGalleryPage?.createModulePageLanguage(
						{
							LanguageId: cs?.id,
							url: "fotogalerie",
							name: "fotogalerie",
							title: "Fotogalerie",
							description: "Vytvořené fotogalerie",
							headline: "Fotogalerie",
						},
						{ transaction }
					);
					await photoGalleryPage?.createModulePageLanguage(
						{
							LanguageId: en?.id,
							url: "photogallery",
							name: "photo gallery",
							title: "Photo gallery",
							description: "Photo galleries",
							headline: "Photo gallery",
						},
						{ transaction }
					);
				}

				const newsPage = await ModulePage.findOne({
					where: { url: "news" },
					transaction,
				});
				if (newsPage) {
					await newsPage?.createModulePageLanguage(
						{
							LanguageId: cs?.id,
							url: "novinky",
							name: "novinky",
							title: "Novinky",
							description: "Nejnovější zprávy a novinky",
							headline: "Novinky",
						},
						{ transaction }
					);
					await newsPage?.createModulePageLanguage(
						{
							LanguageId: en?.id,
							url: "news",
							name: "news",
							title: "News",
							description: "Latest news and updates",
							headline: "News",
						},
						{ transaction }
					);
				}

				const loginPage = await ModulePage.findOne({
					where: { url: "login" },
					transaction,
				});
				if (loginPage) {
					await loginPage?.createModulePageLanguage(
						{
							LanguageId: cs?.id,
							url: "prihlasit",
							name: "přihlásit",
							title: "Přihlášení uživatele",
							description: "Přihlášení uživatele",
							headline: "Přihlášení uživatele",
						},
						{ transaction }
					);
					await loginPage?.createModulePageLanguage(
						{
							LanguageId: en?.id,
							url: "login",
							name: "login",
							title: "User login",
							description: "User login",
							headline: "User login",
						},
						{ transaction }
					);
				}

				const logoutPage = await ModulePage.findOne({
					where: { url: "logout" },
					transaction,
				});
				if (logoutPage) {
					await logoutPage?.createModulePageLanguage(
						{
							LanguageId: cs?.id,
							url: "odhlasit",
							name: "odhlásit",
							title: "Odhlášení uživatele",
							description: "Odhlášení uživatele",
							headline: "Odhlášení uživatele",
						},
						{ transaction }
					);
					await logoutPage?.createModulePageLanguage(
						{
							LanguageId: en?.id,
							url: "logout",
							name: "logout",
							title: "User logout",
							description: "User logout",
							headline: "User logout",
						},
						{ transaction }
					);
				}

				const registerPage = await ModulePage.findOne({
					where: { url: "register" },
					transaction,
				});
				if (registerPage) {
					await registerPage?.createModulePageLanguage(
						{
							LanguageId: cs?.id,
							url: "registrace",
							name: "registrace",
							title: "Registrace uživatele",
							description: "Registrace uživatele",
							headline: "Registrace uživatele",
						},
						{ transaction }
					);
					await registerPage?.createModulePageLanguage(
						{
							LanguageId: en?.id,
							url: "register",
							name: "register",
							title: "User registration",
							description: "User registration",
							headline: "User registration",
						},
						{ transaction }
					);
				}

				const profilePage = await ModulePage.findOne({
					where: { url: "profile" },
					transaction,
				});
				if (profilePage) {
					await profilePage?.createModulePageLanguage(
						{
							LanguageId: cs?.id,
							url: "profil",
							name: "profil",
							title: "Profil uživatele",
							description: "Profil uživatele",
							headline: "Profil uživatele",
						},
						{ transaction }
					);
					await profilePage?.createModulePageLanguage(
						{
							LanguageId: en?.id,
							url: "profile",
							name: "profile",
							title: "User profile",
							description: "User profile",
							headline: "User profile",
						},
						{ transaction }
					);
				}

				const myWebsitesPage = await ModulePage.findOne({
					where: { url: "my-websites" },
					transaction,
				});
				if (myWebsitesPage) {
					await myWebsitesPage?.createModulePageLanguage(
						{
							LanguageId: cs?.id,
							name: "moje webové stránky",
							url: "moje-webove-stranky",
							title: "Moje webové stránky",
							description: "Seznam mých webových stránek",
							headline: "Moje webové stránky",
						},
						{ transaction }
					);
					await myWebsitesPage?.createModulePageLanguage(
						{
							LanguageId: en?.id,
							name: "my websites",
							url: "my-websites",
							title: "My websites",
							description: "List of my websites",
							headline: "My websites",
						},
						{ transaction }
					);
				}

				const createWebsiteLoginPage = await ModulePage.findOne({
					where: { url: "create-website-login" },
					transaction,
				});
				if (createWebsiteLoginPage) {
					await createWebsiteLoginPage?.createModulePageLanguage(
						{
							LanguageId: cs?.id,
							name: "přihlásit/registrovat se",
							url: "vytvorit-webove-stranky-prihlaseni",
							title: "Vytvořit webové stránky - přihlásit / registrovat",
							description:
								"Pro vytvoření webových stránek je notné se přihlásit nebo registrovat.",
							headline:
								"Vytvořit webové stránky - přihlásit / registrovat",
						},
						{ transaction }
					);
					await createWebsiteLoginPage?.createModulePageLanguage(
						{
							LanguageId: en?.id,
							name: "login/register",
							url: "create-website-login",
							title: "Create website - login / register",
							description:
								"In order to create a website you need to login in or register first.",
							headline: "Create website - login / register",
						},
						{ transaction }
					);
				}

				const createWebsitePage = await ModulePage.findOne({
					where: { url: "create-website" },
					transaction,
				});
				if (createWebsitePage) {
					await createWebsitePage?.createModulePageLanguage(
						{
							LanguageId: cs?.id,
							name: "vytvořit webové stránky",
							url: "vytvorit-webove-stranky",
							title: "Vytvořit webové stránky",
							description: "Vytvoření webových stránek.",
							headline: "Vytvořit webové stránky",
						},
						{ transaction }
					);
					await createWebsitePage?.createModulePageLanguage(
						{
							LanguageId: en?.id,
							name: "create website",
							url: "create-website",
							title: "Create website",
							description: "Create a website.",
							headline: "Create website",
						},
						{ transaction }
					);
				}
				const websiteInfoPage = await ModulePage.findOne({
					where: { url: "website-info" },
					transaction,
				});
				if (websiteInfoPage) {
					await websiteInfoPage?.createModulePageLanguage(
						{
							LanguageId: cs?.id,
							name: "Informace webové stránky",
							url: "informace-webove-stranky",
							title: "Informace webové stránky",
							description: "Informace o webové stránce.",
							headline: "Informace webové stránky",
						},
						{ transaction }
					);
					await websiteInfoPage?.createModulePageLanguage(
						{
							LanguageId: en?.id,
							name: "website information",
							url: "website-info",
							title: "Website information",
							description: "Website's information.",
							headline: "Website information",
						},
						{ transaction }
					);
				}
			} catch (e) {
				console.log(e);
			}
		});
	},
	down: async (queryInterface: QueryInterface): Promise<void> => {
		return; // this data is in '20220726700000-modules.ts' already, don't mess with those. Only if using this "up" method then uncomment this.
		await queryInterface.sequelize.transaction(async (transaction) => {
			try {
				const loginPage = await ModulePage.findOne({
					where: { url: "login" },
					transaction,
				});
				if (loginPage)
					await ModulePageLanguage.destroy({
						where: {
							ModulePageId: loginPage.id,
						},
						transaction,
					});

				const logoutPage = await ModulePage.findOne({
					where: { url: "logout" },
					transaction,
				});
				if (logoutPage)
					await ModulePageLanguage.destroy({
						where: {
							ModulePageId: logoutPage.id,
						},
						transaction,
					});

				const registerPage = await ModulePage.findOne({
					where: { url: "register" },
					transaction,
				});
				if (registerPage)
					await ModulePageLanguage.destroy({
						where: {
							ModulePageId: registerPage.id,
						},
						transaction,
					});

				const profilePage = await ModulePage.findOne({
					where: { url: "profile" },
					transaction,
				});
				if (profilePage)
					await ModulePageLanguage.destroy({
						where: {
							ModulePageId: profilePage.id,
						},
						transaction,
					});

				const photogalleryPage = await ModulePage.findOne({
					where: { url: "photogallery" },
					transaction,
				});
				if (photogalleryPage)
					await ModulePageLanguage.destroy({
						where: {
							ModulePageId: photogalleryPage.id,
						},
						transaction,
					});

				const newsPage = await ModulePage.findOne({
					where: { url: "news" },
					transaction,
				});
				if (newsPage)
					await ModulePageLanguage.destroy({
						where: {
							ModulePageId: newsPage.id,
						},
						transaction,
					});
				const myWebsitesPage = await ModulePage.findOne({
					where: { url: "my-websites" },
					transaction,
				});
				if (myWebsitesPage)
					await ModulePageLanguage.destroy({
						where: {
							ModulePageId: myWebsitesPage.id,
						},
						transaction,
					});
				const createWebsiteLoginPage = await ModulePage.findOne({
					where: { url: "create-website-login" },
					transaction,
				});
				if (createWebsiteLoginPage)
					await ModulePageLanguage.destroy({
						where: {
							ModulePageId: createWebsiteLoginPage.id,
						},
						transaction,
					});
				const createWebsitePage = await ModulePage.findOne({
					where: { url: "create-website" },
					transaction,
				});
				if (createWebsitePage)
					await ModulePageLanguage.destroy({
						where: {
							ModulePageId: createWebsitePage.id,
						},
						transaction,
					});
				const websiteInfoPage = await ModulePage.findOne({
					where: { url: "website-info" },
					transaction,
				});
				if (websiteInfoPage)
					await ModulePageLanguage.destroy({
						where: {
							ModulePageId: websiteInfoPage.id,
						},
						transaction,
					});
			} catch (e) {
				console.log(e);
			}
		});
	},
};
