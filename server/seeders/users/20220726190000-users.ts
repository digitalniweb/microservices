import { QueryInterface } from "sequelize";
import type {
	CreationAttributes,
	// IncludeOptions
} from "sequelize";

// import type { Role as RoleType } from "../../digitalniweb-types/server/models/db.js";
// import Role from "../../models/globalData/role.js";

import type {
	Tenant as TenantType,
	User as UserType,
} from "../../../digitalniweb-types/models/users.js";

// import Tenant from "../../models/users/tenant.js";
import User from "../../models/users/user.js";

import type { microservices } from "../../../digitalniweb-types/index.js";
import Tenant from "../../models/users/tenant.js";
import Blacklist from "../../models/users/blacklist.js";
import LoginLog from "../../models/users/loginLog.js";
const microservice: Array<microservices> = ["users"];

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
				// this doesn't work, need to get superadmin role from globalData ms
				// let superadminRole = await Role.findOne({
				// 	where: { name: "superadmin" },
				// 	transaction,
				// });

				const usersData: Array<CreationAttributes<UserType>> = [
					{
						email: "admin@digitalniweb.cz",
						nickname: "Programmer",
						password: "123456789",
						roleId: 1,
						websiteId: 1,
						websitesMsId: 2, // = serviceRegistry id in global data. This may (and will I guess) differ
						active: true,
					},
				];

				// await superadminRole?.createUser(usersData[0], { transaction });

				/* let tenantRole = await Role.findOne({
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
				}); */

				if (process.env.NODE_ENV !== "development") return;

				usersData.push(
					{
						email: "owner@test.cz",
						nickname: "owner",
						password: "123456789!aA",
						roleId: 2,
						websiteId: 1,
						websitesMsId: 2, // = serviceRegistry id in global data. This may (and will I guess) differ
						active: true,
					},
					{
						email: "admin@test.cz",
						nickname: "admin",
						password: "123456789!aA",
						roleId: 3,
						websiteId: 1,
						websitesMsId: 2, // = serviceRegistry id in global data. This may (and will I guess) differ
						active: true,
					}
				);

				await User.create(usersData[1], {
					transaction,
				});

				let admin = await User.create(usersData[2], {
					transaction,
				});

				await admin.createUserModule(
					{ moduleId: 1 },
					{
						transaction,
					}
				);
				await admin.createUserModule(
					{ moduleId: 2 },
					{
						transaction,
					}
				);
				await admin.createUserModule(
					{ moduleId: 3 },
					{
						transaction,
					}
				);

				/* await admin.addPrivileges(adminsPrivileges, {
					transaction,
				}); */

				/* const user: CreationAttributes<UserType> = {
					email: "tenant@digitalniweb.cz",
					password: "123456789!aA",
					websiteId: 1,
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
				}; */

				/* await tenantRole?.createUser(user, {
					include: [{ model: Tenant, transaction } as IncludeOptions],
					transaction,
				}); */
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
				await queryInterface.bulkDelete(Tenant.tableName, {}, {});
				await queryInterface.bulkDelete(Blacklist.tableName, {}, {});
				await queryInterface.bulkDelete(LoginLog.tableName, {}, {});
				await queryInterface.bulkDelete(User.tableName, {}, {});
			} catch (error) {
				console.log(error);
			}
		});
	},
};
