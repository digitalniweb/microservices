import { QueryInterface } from "sequelize";

import { microservices } from "../../../digitalniweb-types/index.js";
// import Website from "../../models/globalData/website.js";
import Module from "../../models/globalData/module.js";
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
				// https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/

				let articles = await Module.create({
					name: "articles",
					model: "Article",
				});

				let photoGallery = await Module.create({
					name: "photoGallery",
					model: "PhotoGallery",
					creditsCost: 30,
				});

				let news = await Module.create({
					name: "news",
					model: "News",
				});

				/* if (process.env.NODE_ENV === "development") {
					let testWebsite = await Website.findOne({
						where: {
							"$MainUrl.url$": "digitalniweblocalhost.cz",
						},
						include: [
							{
								// where: {
								// 	url: "digitalniweblocalhost.cz",
								// },
								model: Url,
								as: "MainUrl",
								attributes: [],
							},
						],
					});

					
					// this works as well
					// if (testWebsite)
					// 	await photoGallery.setWebsites([testWebsite], {
					// 		through: { deletedAt: Date() },
					// 	});

					// if (testWebsite) await testWebsite.setModules([photoGallery]);

					let today = new Date();
					let billingDay = addDays(today, 14).getDate(); // 14 days for free
					if (testWebsite)
						await testWebsite.addModules([photoGallery, news], {
							through: { billingDay },
						});
				} */
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
					Module.tableName,
					{},
					{ transaction }
				);
			} catch (error) {
				console.log(error);
			}
		});
	},
};
