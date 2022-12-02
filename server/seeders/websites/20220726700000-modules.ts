import { QueryInterface } from "sequelize";

import { microservices } from "../../../types/index.d.js";
import Website from "../../models/websites/website.js";
import Module from "../../models/websites/module.js";
import Url from "../../models/websites/url.js";
import { addDays } from "date-fns";
const microservice: Array<microservices> = ["websites"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			try {
				// https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/
				let photoGalleryModule = await Module.create({
					name: "photoGallery",
					active: true,
					dedicatedTable: true,
					creditsCost: 30,
				});

				let newsModule = await Module.create({
					name: "news",
					active: true,
					dedicatedTable: true,
				});

				if (process.env.NODE_ENV === "development") {
					let testWebsite = await Website.findOne({
						where: {
							"$MainUrl.url$": "digitalniweblocalhost.cz",
						},
						include: [
							{
								/* where: {
									url: "digitalniweblocalhost.cz",
								}, */
								model: Url,
								as: "MainUrl",
								attributes: [],
							},
						],
					});

					/* 
					// this works as well
					if (testWebsite)
						await photoGalleryModule.setWebsites([testWebsite], {
							through: { deletedAt: Date() },
						}); */

					// if (testWebsite) await testWebsite.setModules([photoGalleryModule]);

					let today = new Date();
					let billingDay = addDays(today, 14).getDate(); // 14 days for free
					if (testWebsite)
						await testWebsite.addModules([photoGalleryModule, newsModule], {
							through: { billingDay },
						});
				}
			} catch (error) {
				console.log(error);
			}
		});
	},
	down: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			try {
				// await queryInterface.bulkDelete(Module.tableName, {}, { transaction });
			} catch (error) {
				console.log(error);
			}
		});
	},
};
