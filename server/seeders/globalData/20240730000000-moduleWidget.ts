import { QueryInterface } from "sequelize";

import type { microservices } from "../../../digitalniweb-types/index.js";
// import Website from "../../models/globalData/website.js";
import Widget from "../../models/globalData/widget.js";
import Module from "../../models/globalData/module.js";
import type { Module as ModuleType } from "../../../digitalniweb-types/models/globalData.js";
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
				let textWidget = await Widget.findOne({
					where: { name: "text" },
					transaction,
				});

				let textModules = [] as ModuleType[];
				let articleModule = await Module.findOne({
					where: { name: "articles" },
					transaction,
				});
				if (articleModule) textModules.push(articleModule);

				let newsModule = await Module.findOne({
					where: { name: "news" },
					transaction,
				});
				if (newsModule) textModules.push(newsModule);

				let photoGalleryModule = await Module.findOne({
					where: { name: "photoGallery" },
					transaction,
				});
				if (photoGalleryModule) textModules.push(photoGalleryModule);

				if (textModules.length > 0 && textWidget)
					await textWidget.addModules(textModules);
			} catch (error) {
				console.log(error);
			}
		});
	},
	down: async (queryInterface: QueryInterface): Promise<void> => {
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			try {
				await queryInterface.bulkDelete(
					Widget.tableName,
					{},
					{ transaction }
				);
			} catch (error) {
				console.log(error);
			}
		});
	},
};
