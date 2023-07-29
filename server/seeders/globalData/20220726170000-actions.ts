import { QueryInterface, CreationAttributes } from "sequelize";

import { Action as ActionType } from "../../../digitalniweb-types/models/globalData.js";

import Action from "../../models/globalData/action.js";

import { microservices } from "../../../digitalniweb-types/index.js";
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
				const ActionsObjects: CreationAttributes<ActionType>[] = [
					{
						name: "read",
					},
					{
						name: "write",
					},
					{
						name: "delete",
					},
					{
						name: "makeAnOrder",
					},
					{
						name: "makeAnOrder",
					},
					{
						name: "premium",
					},
					{
						name: "register",
					},
				];
				await Action.bulkCreate<ActionType>(ActionsObjects, {
					validate: true,
					individualHooks: true,
					transaction,
				});
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
				await queryInterface.bulkDelete(Action.tableName, {}, {});
			} catch (error) {
				console.log(error);
			}
		});
	},
};
