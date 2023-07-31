import { QueryInterface, CreationAttributes } from "sequelize";

import { Role as RoleTypeType } from "../../../digitalniweb-types/models/globalData.js";

import Role from "../../models/globalData/role.js";

import { microservices } from "../../../digitalniweb-types/index.js";
import RoleType from "../../models/globalData/roleType.js";
const microservice: Array<microservices> = ["globalData"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
			return;
		let roleAdmin = await RoleType.findOne({
			where: {
				name: "admin",
			},
		});
		let roleUser = await RoleType.findOne({
			where: {
				name: "user",
			},
		});
		await queryInterface.sequelize.transaction(async (transaction) => {
			try {
				/* const rolesObjects: CreationAttributes<RoleTypeType>[] = [
					{
						name: "superadmin",
						RoleTypeId: 1,
					},
					{
						name: "owner",
						RoleTypeId: 1,
					},
					{
						name: "admin",
						RoleTypeId: 1,
					},
					{
						name: "tenant",
						RoleTypeId: 2,
					},
					{
						name: "user",
						RoleTypeId: 2,
					},
				];
				await Role.bulkCreate<RoleTypeType>(rolesObjects, {
					validate: true,
					individualHooks: true,
					transaction,
				}); */
				if (!roleAdmin || !roleUser) throw "RoleTypes didn't load.";
				await roleAdmin.createRole({ name: "superadmin" });
				await roleAdmin.createRole({ name: "owner" });
				await roleAdmin.createRole({ name: "admin" });
				await roleUser.createRole({ name: "user" });
				await roleUser.createRole({ name: "tenant" });
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
				await queryInterface.bulkDelete(Role.tableName, {}, {});
			} catch (error) {
				console.log(error);
			}
		});
	},
};
