import { QueryInterface } from "sequelize";

import AppType from "../../models/globalData/appType.js";

import { microservices } from "../../../digitalniweb-types/index.js";
const microservice: Array<microservices> = ["globalData"];

export default {
	up: async (): Promise<void> => {
		return;
		await AppType.create({
			name: "saas-host",
		});
		await AppType.create({
			name: "saas-tenant",
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
				return await queryInterface.bulkDelete(
					AppType.tableName,
					{},
					{ transaction }
				);
			} catch (error) {
				console.log(error);
			}
		});
	},
};
