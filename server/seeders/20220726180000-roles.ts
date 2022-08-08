import { QueryInterface, CreationAttributes } from "sequelize";

import { users } from "../../types/models";
import RoleType = users.Role;

import Role from "../models/role";

export = {
	up: async (queryInterface: QueryInterface): Promise<void> =>
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
		}),
	down: (queryInterface: QueryInterface): Promise<void> =>
		queryInterface.sequelize.transaction(async (transaction) => {
			try {
				await queryInterface.bulkDelete(Role.tableName, {}, {});
			} catch (error) {
				console.log(error);
			}
		}),
};
