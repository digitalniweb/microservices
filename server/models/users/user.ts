"use strict";
// const { customBELogger } = require("./../../customFunctions/logger");

import { DataTypes } from "sequelize";

import crypto from "node:crypto";

import db from "./../index";

import { users } from "../../../types/models/users";
import User = users.User;

import Tenant from "./tenant";

const User = db.define<User>(
	"User",
	{
		id: {
			type: DataTypes.INTEGER,
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

export default User;
