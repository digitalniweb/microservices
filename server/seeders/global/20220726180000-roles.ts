import { QueryInterface, CreationAttributes } from "sequelize";

import { global } from "../../../types/models/global.js";
import RoleType = global.Role;

import Role from "../../models/global/role.js";

import { microservices } from "../../../types/index.js";
const microservice: Array<microservices> = ["global"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			try {
				const rolesObjects: CreationAttributes<RoleType>[] = [
					{
						name: "superadmin",
						type: "admin",
					},
					{
						name: "owner",
						type: "admin",
					},
					{
						name: "admin",
						type: "admin",
					},
					{
						name: "tenant",
						type: "user",
					},
					{
						name: "user",
						type: "user",
					},
				];
				await Role.bulkCreate<RoleType>(rolesObjects, {
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
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			try {
				await queryInterface.bulkDelete(Role.tableName, {}, {});
			} catch (error) {
				console.log(error);
			}
		});
	},
};
