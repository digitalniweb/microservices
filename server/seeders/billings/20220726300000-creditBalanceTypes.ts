import { QueryInterface } from "sequelize";

import CreditBalanceType from "../../models/billings/creditBalanceType";

import { microservices } from "../../../types";
const microservice: Array<microservices> = ["billings"];

export = {
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
