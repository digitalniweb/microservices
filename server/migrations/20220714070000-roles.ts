import { QueryInterface, DataTypes } from "sequelize";

import { dbModels } from "../../types/server/models/db";

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> =>
		await queryInterface.sequelize.transaction(async (transaction) => {
			const models: dbModels = (await import("../models/index")).models;
			await new Promise((r) => setTimeout(r, 0)); // need to wait for the end of event loop, because models won't load in time (inside forEach loop of await import() in models/index) without
			console.log(models);

			return await queryInterface.createTable(
				models.Role.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					name: {
						type: DataTypes.STRING(63),
						unique: true,
						allowNull: true,
					},
					type: {
						type: DataTypes.STRING(63),
						allowNull: true,
					},
				},
				{
					charset: "utf8mb4",
					collate: "utf8mb4_unicode_ci",
					transaction,
				}
			);
		}),

	down: (queryInterface: QueryInterface): Promise<void> =>
		queryInterface.sequelize.transaction(async (transaction) => {
			const models: dbModels = (await import("../models/index")).models;
			await new Promise((r) => setTimeout(r, 0)); // need to wait for the end of event loop, because models won't load in time (inside forEach loop of await import() in models/index) without
			return await queryInterface.dropTable(models.User.tableName, {
				transaction,
			});
		}),
};
