import { QueryInterface } from "sequelize";

import Currency from "../../models/billings/currency";

import { microservices } from "../../../types";
const microservice: Array<microservices> = ["billings"];

export = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			try {
				await Currency.create(
					{
						code: "EUR",
						sign: "€",
					},
					{
						transaction,
					}
				);
				await Currency.create(
					{
						code: "CZK",
						sign: "Kč",
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
					Currency.tableName,
					{},
					{ transaction }
				);
			} catch (error) {
				console.log(error);
			}
		});
	},
};
