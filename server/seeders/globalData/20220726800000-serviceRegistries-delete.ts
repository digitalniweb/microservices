import { QueryInterface } from "sequelize";

import { microservices } from "../../../types/index.js";
import Microservice from "../../models/globalData/microservice.js";
import ServiceRegistry from "../../models/globalData/serviceRegistry.js";
import { randomString } from "../../../custom/functions/randomGenerator.js";
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
			return;
			try {
				// https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/
				let microserviceWebsites = await Microservice.create(
					{
						name: "websites",
					},
					{
						transaction,
					}
				);

				let websitesServiceRegistry =
					await microserviceWebsites.createServiceRegistry(
						{
							host: "srv1.digitalniweb.cz",
							port: 3000,
							uniqueName: randomString(10, false),
						},
						{ transaction }
					);
				microserviceWebsites.setMainServiceRegistry(
					websitesServiceRegistry
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
			return;
			try {
				await queryInterface.bulkDelete(
					ServiceRegistry.tableName,
					{},
					{ transaction }
				);
				await queryInterface.bulkDelete(
					Microservice.tableName,
					{},
					{ transaction }
				);
			} catch (error) {
				console.log(error);
			}
		});
	},
};
