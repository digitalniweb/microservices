import { QueryInterface, CreationAttributes, IncludeOptions } from "sequelize";

// import { Role as RoleType } from "../../types/server/models/db";
import Role from "../models/role";

import {
	User as UserType,
	Tenant as TenantType,
} from "../../types/server/models/db";
import Tenant from "../models/tenant";
import User from "../models/user";

export = {
	up: async (queryInterface: QueryInterface): Promise<void> =>
		await queryInterface.sequelize.transaction(async (transaction) => {
			try {
				let superadminRole = await Role.findOne({
					where: { name: "superadmin" },
					transaction,
				});
				await superadminRole?.createUser(
					{
						email: "admin@digitalniweb.cz",
						nickname: "Programmer",
						password: "123456789",
						domainId: 1,
						active: true,
					},
					{ transaction }
				);

				let tenantRole = await Role.findOne({
					where: { name: "tenant" },
					transaction,
				});

				const user: CreationAttributes<UserType> = {
					email: "tenant@digitalniweb.cz",
					password: "123456789",
					domainId: 1,
					createdAt: new Date(),
					updatedAt: new Date(),
					active: true,
					Tenant: {
						firstName: "test",
						lastName: "tenant",
						telephone: "123456789",
						city: "New York",
						zip: "12345",
						streetAddress: "NY Street",
						houseNumber: 3,
						landRegistryNumber: 30,
						company: false,
						subscribeNewsletters: false,
					} as TenantType,
				};

				await tenantRole?.createUser(user, {
					include: [{ model: Tenant, transaction } as IncludeOptions],
					transaction,
				});
			} catch (error) {
				console.log(error);
			}

			/* const usersData: CreationAttributes<UserType>[] = [
				{
					email: "admin@digitalniweb.cz",
					nickname: "Programmer",
					password: "123456789",
					domainId: 1,
					active: true,
				},
				{
					email: "owner@test.cz",
					nickname: "owner",
					password: "123456789",
					domainId: 1,
					active: true,
				},
				{
					email: "admin@test.cz",
					nickname: "admin",
					password: "123456789",
					domainId: 1,
					active: true,
				},
			]; */
		}),
	down: (queryInterface: QueryInterface): Promise<void> =>
		queryInterface.sequelize.transaction(async (transaction) => {
			try {
				await queryInterface.bulkDelete(User.tableName, {}, {});
			} catch (error) {
				console.log(error);
			}
		}),
};
