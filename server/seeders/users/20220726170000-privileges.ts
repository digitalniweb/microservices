import { QueryInterface, CreationAttributes } from "sequelize";

import { users } from "../../../types/models/users";
import PrivilegeType = users.Privilege;

import Privilege from "../../models/users/privilege";

import { microservices } from "../../../types";
const microservice: Array<microservices> = ["users"];

export = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!microservice.includes(process.env.MICROSERVICE_NAME as microservices))
			return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			try {
				const privilegesObjects: CreationAttributes<PrivilegeType>[] = [
					{
						name: "articles",
						type: "admin",
					},
					{
						name: "menu",
						type: "admin",
					},
					{
						name: "appereance",
						type: "admin",
					},
					{
						name: "news",
						type: "admin",
					},
					{
						name: "forms",
						type: "admin",
					},
					{
						name: "users",
						type: "admin",
					},
					{
						name: "redirects",
						type: "admin",
					},
					{
						name: "webinformation",
						type: "admin",
					},
					{
						name: "owner-information",
						type: "admin",
					},
					{
						name: "url-information",
						type: "admin",
					},
					{
						name: "analytics-marketing",
						type: "admin",
					},
				];
				await Privilege.bulkCreate<PrivilegeType>(privilegesObjects, {
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
				await queryInterface.bulkDelete(Privilege.tableName, {}, {});
			} catch (error) {
				console.log(error);
			}
		});
	},
};
