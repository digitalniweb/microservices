import { QueryInterface } from "sequelize";
import type { CreationAttributes } from "sequelize";

import type { Action as ActionType } from "../../../digitalniweb-types/models/globalData";

import Action from "../../models/globalData/action.js";

import type { microservices } from "../../../digitalniweb-types/index";
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
					{ name: "write" },
					{ name: "create" },
					{ name: "read" },
					{ name: "delete" },
					{ name: "modify" },
					{ name: "register" },
					{ name: "premium" },
					{ name: "makeOrder" },
					{ name: "purchase" },
					{ name: "cancel" },
					{ name: "refund" },
					{ name: "pay" },
					{ name: "pending" },
					{ name: "expire" },
					{ name: "creditAdd" },
					{ name: "creditSubtract" },
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
				await queryInterface.bulkDelete(
					Action.tableName,
					{},
					{ transaction }
				);
			} catch (error) {
				console.log(error);
			}
		});
	},
};
