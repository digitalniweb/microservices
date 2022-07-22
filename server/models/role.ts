"use strict";

import { DataTypes, Sequelize } from "sequelize";

import { models } from "./index";

import { Role } from "../../types/server/models/db";

export default async (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
	const Role = sequelize.define<Role>(
		"Role",
		{
			id: {
				type: dataTypes.INTEGER.UNSIGNED,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: dataTypes.STRING,
				allowNull: false,
			},
			type: {
				// login type - /admin or /modules
				type: dataTypes.STRING,
				allowNull: false,
			},
		},
		{
			timestamps: false, // createdAt, updatedAt
			paranoid: false, // deletedAt
			// freezeTableName: true,
			// tableName: 'Role',
		}
	);

	/* Role.associate = function (models) {
		Role.hasOne(models.User);
	}; */

	return Role;
};
