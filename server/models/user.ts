"use strict";
// const { customBELogger } = require("./../../customFunctions/logger");

import { DataTypes } from "sequelize";
import { Request } from "express";

import crypto from "node:crypto";

import db from "./index";

import { User } from "../../types/server/models/db";
import Tenant from "./tenant";

const User = db.define<User>(
	"User",
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
		},
		nickname: {
			type: new DataTypes.STRING(255),
			allowNull: true,
			validate: {
				len: [0, 255],
			},
		},
		email: {
			type: DataTypes.STRING,
			validate: {
				isEmail: true,
			},
		},
		password: {
			type: DataTypes.STRING,
		},
		refreshTokenSalt: {
			type: new DataTypes.STRING(20),
			allowNull: false,
			validate: {
				len: [20, 20],
			},
		},
		RoleId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		domainId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
			allowNull: false,
		},
	},
	{
		timestamps: true, // createdAt, updatedAt
		paranoid: true, // deletedAt
	}
);
User.beforeValidate((user: User) => {
	if (!user.refreshTokenSalt)
		user.refreshTokenSalt = crypto
			.randomBytes(17)
			.toString("base64")
			.slice(0, 20);
});

User.beforeCreate(async (user: User) => {
	user.password = await hashUserPassword(user.password);
	user.refreshTokenSalt = createRefreshTokenSalt();
});

// 'beforeUpdate' hook is called when instance.save() or instance.update() is used
// when model.update() is used 'beforeBulkUpdate' will is called
User.beforeBulkUpdate(async (options: any) => {
	if (options.attributes.password)
		options.attributes.password = await hashUserPassword(
			options.attributes.password
		);

	// this will change refreshTokenSalt only if I explicitly create 'refreshTokenSalt' (with any truthy value) attribute in model.update() method. I don't want 'refreshTokenSalt' to be changed every time because by changing it user would get logged out.
	if (options.attributes.refreshTokenSalt)
		options.attributes.refreshTokenSalt = createRefreshTokenSalt();
});

async function hashUserPassword(password: string): Promise<string> {
	return await crypto
		.createHash("sha512")
		.update(password, "utf8")
		.digest("base64");
}
function createRefreshTokenSalt() {
	return crypto.randomBytes(17).toString("base64").slice(0, 20);
}

Tenant.belongsTo(User);
User.hasOne(Tenant);

/* User.prototype.authenticate = async function (
		login: string,
		password: string,
		req: Request
	) {
		// !!! this returns all data including password and refreshSalt !!!
		// You need to decide in calling method what to do with these information. Remove some of them before sending to user (as in api/controller/users -> authenticate) etc.
		try {
			const models = await import("./index");
			const user = await User.findOne({
				where: { email: login, active: 1 },
				paranoid: true,
				include: [
					{
						attributes: ["name", "type"],
						model: models.Role,
					},
					{
						attributes: ["name"],
						model: models.Privilege,
					},
				],
			});

			if (user === null) return false;
			if (
				!(
					crypto
						.createHash("sha512")
						.update(password, "utf8")
						.digest("base64") ===
					crypto
						.createHash("sha512")
						.update(user.password, "utf8")
						.digest("base64")
				)
			)
				return false;
			return user;
		} catch (error) {
			// customBELogger({
			// 	error,
			// 	code: 500,
			// 	message: "User authentication failed",
			// });
			return false;
		}
	};

	// User.hasOne(models.Tenant);

	// User.associate = function (models) {
	// 	User.hasOne(models.Tenant);
	// 	User.belongsTo(models.Role);
	// 	User.belongsToMany(models.Privilege, {
	// 		through: models.UserPrivilege.tableName,
	// 	});
	// };
	return User;
}; */

/* module.exports = (sequelize: Sequelize, DataTypes: DataType) => {
	let modelAttributes = {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nickname: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				len: [0, 255],
			},
		},
		email: {
			type: DataTypes.STRING,
			validate: {
				isEmail: true,
			},
		},
		password: {
			type: DataTypes.STRING,
		},
		refreshTokenSalt: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [20, 20],
			},
		},
		RoleId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		domainId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
			allowNull: false,
		},
	};

	const User = sequelize.define(
		"User",
		{ ...modelAttributes },
		{
			timestamps: true, // createdAt, updatedAt
			paranoid: true, // deletedAt
		}
	);
	User.beforeValidate((user) => {
		if (!user.refreshTokenSalt)
			user.refreshTokenSalt = crypto
				.randomBytes(17)
				.toString("base64")
				.slice(0, 20);
		return true;
	});

	User.beforeCreate(async (user) => {
		user.password = await hashUserPassword(user.password);
		user.refreshTokenSalt = createRefreshTokenSalt();
		return true;
	});

	// 'beforeUpdate' hook is called when instance.save() or instance.update() is used
	// when model.update() is used 'beforeBulkUpdate' will is called
	User.beforeBulkUpdate(async (options) => {
		if (options.attributes.password)
			options.attributes.password = await hashUserPassword(
				options.attributes.password
			);

		// this will change refreshTokenSalt only if I explicitly create 'refreshTokenSalt' (with any truthy value) attribute in model.update() method. I don't want 'refreshTokenSalt' to be changed every time because by changing it user would get logged out.
		if (options.attributes.refreshTokenSalt)
			options.attributes.refreshTokenSalt = createRefreshTokenSalt();

		return true;
	});

	async function hashUserPassword(password) {
		return await crypto.createHash("sha512").update("password", "utf8");
	}
	function createRefreshTokenSalt(refreshTokenSalt) {
		return crypto.randomBytes(17).toString("base64").slice(0, 20);
	}

	User.authenticate = async function (login, password, req) {
		// !!! this returns all data including password and refreshSalt !!!
		// You need to decide in calling method what to do with these information. Remove some of them before sending to user (as in api/controller/users -> authenticate) etc.
		try {
			const models = require("./index");
			const user = await User.findOne({
				where: { email: login, active: 1 },
				paranoid: true,
				include: [
					{
						attributes: ["name", "type"],
						model: models.Role,
					},
					{
						attributes: ["name"],
						model: models.Privilege,
					},
				],
			});

			if (user === null) return false;
			if (
				!(
					crypto
						.createHash("sha512")
						.update(password, "utf8")
						.digest("base64") ===
					crypto
						.createHash("sha512")
						.update(user.password, "utf8")
						.digest("base64")
				)
			)
				return false;
			return user;
		} catch (error) {
			// customBELogger({
			// 	error,
			// 	code: 500,
			// 	message: "User authentication failed",
			// });
			return false;
		}
	};

	User.associate = function (models) {
		// User.hasOne(models.Tenant);
		// User.belongsTo(models.Role);
		// User.belongsToMany(models.Privilege, {
		// 	through: models.UserPrivilege.tableName,
		// });
	};
 */

export default User;
