import { QueryInterface } from "sequelize";

import { microservices } from "../../../types/index.js";
// import Website from "../../models/globalData/website.js";
import Module from "../../models/globalData/module.js";
// import Url from "../../models/globalData/url.js";
// import { addDays } from "date-fns";
const microservice: Array<microservices> = ["globalData"];

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
