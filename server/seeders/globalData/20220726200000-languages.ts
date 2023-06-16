import { QueryInterface } from "sequelize";

import Language from "../../models/globalData/language.js";

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
				await Language.create(
					{
						code: "cs",
						name: "Čeština",
						icon: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5MDAiIGhlaWdodD0iNjAwIj4NCgk8cmVjdCB3aWR0aD0iOTAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2Q3MTQxYSIvPg0KCTxyZWN0IHdpZHRoPSI5MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZmZmIi8+DQoJPHBhdGggZD0iTSA0NTAsMzAwIDAsMCBWIDYwMCB6IiBmaWxsPSIjMTE0NTdlIi8+DQo8L3N2Zz4=",
					},
					{
						transaction,
					}
				);
				if (process.env.NODE_ENV !== "development") return;
				await Language.create(
					{
						code: "en",
						name: "English",
						icon: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNjAgMzAiIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYwMCI+CjxjbGlwUGF0aCBpZD0icyI+Cgk8cGF0aCBkPSJNMCwwIHYzMCBoNjAgdi0zMCB6Ii8+CjwvY2xpcFBhdGg+CjxjbGlwUGF0aCBpZD0idCI+Cgk8cGF0aCBkPSJNMzAsMTUgaDMwIHYxNSB6IHYxNSBoLTMwIHogaC0zMCB2LTE1IHogdi0xNSBoMzAgeiIvPgo8L2NsaXBQYXRoPgo8ZyBjbGlwLXBhdGg9InVybCgjcykiPgoJPHBhdGggZD0iTTAsMCB2MzAgaDYwIHYtMzAgeiIgZmlsbD0iIzAxMjE2OSIvPgoJPHBhdGggZD0iTTAsMCBMNjAsMzAgTTYwLDAgTDAsMzAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSI2Ii8+Cgk8cGF0aCBkPSJNMCwwIEw2MCwzMCBNNjAsMCBMMCwzMCIgY2xpcC1wYXRoPSJ1cmwoI3QpIiBzdHJva2U9IiNDODEwMkUiIHN0cm9rZS13aWR0aD0iNCIvPgoJPHBhdGggZD0iTTMwLDAgdjMwIE0wLDE1IGg2MCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEwIi8+Cgk8cGF0aCBkPSJNMzAsMCB2MzAgTTAsMTUgaDYwIiBzdHJva2U9IiNDODEwMkUiIHN0cm9rZS13aWR0aD0iNiIvPgo8L2c+Cjwvc3ZnPgo=",
					},
					{
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
					Language.tableName,
					{},
					{ transaction }
				);
			} catch (error) {
				console.log(error);
			}
		});
	},
};
