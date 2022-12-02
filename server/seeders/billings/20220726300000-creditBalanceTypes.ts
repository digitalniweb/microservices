import { QueryInterface } from "sequelize";

import CreditBalanceType from "../../models/billings/creditBalanceType.js";

import { microservices } from "../../../types/index.d.js";
const microservice: Array<microservices> = ["billings"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			try {
				await CreditBalanceType.create(
					{
						name: "modulesUsage",
						description: "Credit compensation for monthly usage of module(s).",
					},
					{
						transaction,
					}
				);
				await CreditBalanceType.create(
					{
						name: "websiteUsage",
						description: "Credit compensation for monthly usage of website.",
					},
					{
						transaction,
					}
				);
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
				await queryInterface.bulkDelete(
					CreditBalanceType.tableName,
					{},
					{ transaction }
				);
			} catch (error) {
				console.log(error);
			}
		});
	},
};
