import { QueryInterface, CreationAttributes } from "sequelize";

import { Privilege as PrivilegeType } from "../../../digitalniweb-types/models/globalData.js";

import Privilege from "../../models/globalData/privilege.js";

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
		if (
			!microservice.includes(
				process.env.MICROSERVICE_NAME as microservices
			)
		)
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
