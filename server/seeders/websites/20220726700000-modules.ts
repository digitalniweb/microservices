import { QueryInterface } from "sequelize";

import { microservices } from "../../../types";
import Website from "../../models/websites/website";
import Module from "../../models/websites/module";
import Url from "../../models/websites/url";
const microservice: Array<microservices> = ["websites"];

export = {
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
					creditCostDay: 2,
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
					let billingDay = new Date(
						today.setDate(today.getDate() + 14)
					).getDate(); // first 14 days are for free
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
