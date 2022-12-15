import { QueryInterface, CreationAttributes } from "sequelize";

import { global } from "../../../types/models/global.js";
import PrivilegeType = global.Privilege;

import Privilege from "../../models/global/privilege.js";

import { microservices } from "../../../types/index.js";
const microservice: Array<microservices> = ["global"];

export default {
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
