import { QueryInterface, DataTypes } from "sequelize";

import Tenant from "../models/tenant";
import { Tenant as TenantType } from "../../types/server/models/db";
import User from "../models/user";

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> =>
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<TenantType>(
				Tenant.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					UserId: {
						type: DataTypes.INTEGER,
						references: {
							model: User.tableName,
							key: "id",
						},
						onDelete: "CASCADE",
					},
					academicDegree: {
						allowNull: true,
						type: DataTypes.STRING(10),
					},
					firstName: {
						allowNull: false,
						type: DataTypes.STRING(30),
					},
					lastName: {
						allowNull: false,
						type: DataTypes.STRING(30),
					},
					telephone: {
						allowNull: false,
						type: DataTypes.STRING(20),
					},
					countryId: {
						type: DataTypes.INTEGER.UNSIGNED,
						/*
							// must get done - table in DB for countries with IDs and translations which the APP accepts 
							references: {
								model: Country.tableName,
								key: "id",
							}, */
					},
					city: {
						allowNull: false,
						type: DataTypes.STRING(50),
					},
					zip: {
						allowNull: false,
						type: DataTypes.STRING(10),
					},
					streetAddress: {
						allowNull: false,
						type: DataTypes.STRING(50),
					},
					houseNumber: {
						allowNull: false,
						type: DataTypes.SMALLINT.UNSIGNED,
					},
					landRegistryNumber: {
						allowNull: false,
						type: DataTypes.MEDIUMINT.UNSIGNED,
					},
					company: {
						allowNull: false,
						defaultValue: 0,
						type: DataTypes.BOOLEAN,
					},
					companyName: {
						type: DataTypes.STRING(200),
					},
					tin: {
						type: DataTypes.STRING(15),
					},
					vatId: {
						type: DataTypes.STRING(15),
					},
					subscribeNewsletters: {
						allowNull: false,
						defaultValue: 1,
						type: DataTypes.BOOLEAN,
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
			return await queryInterface.dropTable(Tenant.tableName, {
				transaction,
			});
		}),
};
