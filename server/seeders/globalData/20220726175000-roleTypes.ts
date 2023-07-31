import { QueryInterface, CreationAttributes } from "sequelize";

import { RoleType as RoleTypeType } from "../../../digitalniweb-types/models/globalData.js";

import RoleType from "../../models/globalData/roleType.js";

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
				const rolesObjects: CreationAttributes<RoleTypeType>[] = [
					{
						name: "admin",
					},
					{
						name: "user",
					},
				];
				await RoleType.bulkCreate<RoleTypeType>(rolesObjects, {
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
				await queryInterface.bulkDelete(RoleType.tableName, {}, {});
			} catch (error) {
				console.log(error);
			}
		});
	},
};
