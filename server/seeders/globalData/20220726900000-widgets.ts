import { QueryInterface } from "sequelize";

import { microservices } from "../../../digitalniweb-types/index.js";
// import Website from "../../models/globalData/website.js";
import Widget from "../../models/globalData/widget.js";
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
				await Widget.create(
					{
						name: "text",
						widgetName: "Text",
						component: "WebWidgetsText",
						icon: "mdi-format-text",
					},
					{ transaction }
				);
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
