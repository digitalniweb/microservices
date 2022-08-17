import { QueryInterface, CreationAttributes } from "sequelize";

import { users } from "../../../types/models/users";
import RoleType = users.Role;

import Role from "../../models/users/role";

import { microservices } from "./../../../types";
const microservice: Array<microservices> = ["users"];

export = {
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
