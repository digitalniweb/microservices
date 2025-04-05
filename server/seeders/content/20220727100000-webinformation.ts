import { QueryInterface } from "sequelize";

import WebInformation from "../../models/content/webInformation.js";
import WebInformationLanguage from "../../models/content/webInformationLanguage.js";
import type { WebInformationLanguage as WebInformationLanguageType } from "../../../digitalniweb-types/models/content.js";

import type { microservices } from "../../../digitalniweb-types/index.js";
const microservice: Array<microservices> = ["content"];

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
				await WebInformation.create(
					{
						name: "Digital web",
						city: "Praha",
						country: "Czech republic",
						email: "digitalniweb@gmail.cz",
						streetAddress: "Yemen street",
						houseNumber: "1",
						addressPattern: "STREET, COUNTRY",
						fullAddress: "Yemen street, Yemen",
						googleTagManagerActive: false,
						owner: "Digitální web",
						telephone: "+420 777 111 111",
						websiteId: 1,
						websitesMsId: 3,
						zip: "000 01",
						WebInformationLanguages: [
							{
								languageId: 1,
								name: "Digitální web",
							} as WebInformationLanguageType,
						],
					},
					{
						include: [{ model: WebInformationLanguage }],
						transaction,
					}
				);
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
				await queryInterface.bulkDelete(
					WebInformation.tableName,
					{},
					{ transaction }
				);
			} catch (error) {
				console.log(error);
			}
		});
	},
};
