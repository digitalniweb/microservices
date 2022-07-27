import { QueryInterface } from "sequelize";

// import { Role as RoleType } from "../../types/server/models/db";
import Role from "../models/role";

// import { User as UserType } from "../../types/server/models/db";
import User from "../models/role";

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
