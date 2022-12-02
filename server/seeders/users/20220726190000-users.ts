import { QueryInterface, CreationAttributes, IncludeOptions } from "sequelize";

// import { Role as RoleType } from "../../types/server/models/db.js";
import Role from "../../models/users/role.js";

import { users } from "../../../types/models/users.js";
import TenantType = users.Tenant;
import UserType = users.User;

import Tenant from "../../models/users/tenant.js";
import User from "../../models/users/user.js";
import Privilege from "../../models/users/privilege.js";

import { microservices } from "./../../../types/index.d.js";
const microservice: Array<microservices> = ["users"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			try {
				const usersData: Array<CreationAttributes<UserType>> = [
					{
						email: "admin@digitalniweb.cz",
						nickname: "Programmer",
						password: "123456789",
						RoleId: 1,
						domainId: 1,
						active: true,
					},
					{
						email: "owner@test.cz",
						nickname: "owner",
						password: "123456789",
						RoleId: 2,
						domainId: 1,
						active: true,
					},
					{
						email: "admin@test.cz",
						nickname: "admin",
						password: "123456789",
						RoleId: 3,
						domainId: 1,
						active: true,
					},
				];

				let superadminRole = await Role.findOne({
					where: { name: "superadmin" },
					transaction,
				});
				await superadminRole?.createUser(usersData[0], { transaction });

				let tenantRole = await Role.findOne({
					where: { name: "tenant" },
					transaction,
				});

				let adminsPrivileges = await Privilege.findAll({
					where: {
						name: [
							"articles",
							"menu",
							"webinformation",
							"owner-information",
							"url-information",
							"analytics-marketing",
						],
					},
				});

				await User.create(usersData[1], {
					transaction,
				});

				let admin = await User.create(usersData[2], {
					transaction,
				});

				await admin.addPrivileges(adminsPrivileges, {
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
		});
	},
	down: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			try {
				await queryInterface.bulkDelete(User.tableName, {}, {});
			} catch (error) {
				console.log(error);
			}
		});
	},
};
