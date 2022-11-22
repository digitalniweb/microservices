import { QueryInterface } from "sequelize";

import Status from "../../models/billings/status";

import { microservices } from "../../../types";
const microservice: Array<microservices> = ["billings"];

export = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			try {
				await Status.create(
					{
						name: "pending",
					},
					{
						transaction,
					}
				);
				await Status.create(
					{
						name: "done",
					},
					{
						transaction,
					}
				);
				await Status.create(
					{
						name: "error",
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
				await queryInterface.bulkDelete(Status.tableName, {}, { transaction });
			} catch (error) {
				console.log(error);
			}
		});
	},
};
