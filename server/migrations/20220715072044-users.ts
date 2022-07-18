import { QueryInterface, DataTypes, Sequelize, ModelDefined } from "sequelize";

import { dbModels } from "../../types/server/models/db";

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> =>
		await queryInterface.sequelize.transaction(async (transaction) => {
			const models: dbModels = (await import("../models/index")).models;
			await new Promise((r) => setTimeout(r, 0)); // need to wait for the end of event loop, because models won't load in time (inside forEach loop of await import() in models/index) without

			return await queryInterface.createTable(
				models.User.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					nickname: {
						type: DataTypes.STRING(255),
						unique: true,
						allowNull: true,
					},
					email: {
						type: DataTypes.STRING,
						allowNull: true,
					},
					password: {
						type: DataTypes.STRING,
						allowNull: false,
					},
					refreshTokenSalt: {
						type: DataTypes.STRING(20),
						allowNull: false,
					},
					RoleId: {
						type: DataTypes.INTEGER,
						references: {
							model: models.Role.tableName,
							key: "id",
						},
					},
					domainId: {
						type: DataTypes.INTEGER.UNSIGNED,
					},
					active: {
						type: DataTypes.BOOLEAN,
						allowNull: false,
						defaultValue: true,
					},
					createdAt: {
						allowNull: false,
						type: DataTypes.DATE,
					},
					updatedAt: {
						allowNull: false,
						type: DataTypes.DATE,
					},
					deletedAt: {
						type: DataTypes.DATE,
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
