import { QueryInterface, CreationAttributes, IncludeOptions } from "sequelize";

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
				let photogalleryModule = await Module.create({
					name: "photogallery",
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
						await photogalleryModule.setWebsites([testWebsite], {
							through: { deletedAt: Date() },
						}); */

					if (testWebsite) await testWebsite.setModules([photogalleryModule]);
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
