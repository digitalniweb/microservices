"use strict";
// const { log } = require("./../../customFunctions/logger");

import { DataTypes } from "sequelize";

import { randomString } from "./../../../digitalniweb-custom/functions/randomGenerator.js";

import db from "./../index.js";

import { User } from "../../../digitalniweb-types/models/users.js";

import Tenant from "./tenant.js";
import { hashString } from "../../../digitalniweb-custom/functions/hashString.js";

const User = db.define<User>(
	"User",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		uuid: {
			type: DataTypes.UUID,
			allowNull: false,
			unique: true,
		},
		credit: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: null,
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
		roleId: {
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
	if (!user.refreshTokenSalt) user.refreshTokenSalt = randomString(20);
});

User.beforeCreate((user: User) => {
	user.password = hashUserPassword(user.password);
	user.refreshTokenSalt = createRefreshTokenSalt();
});

// 'beforeUpdate' hook is called when instance.save() or instance.update() is used
// when model.update() is used 'beforeBulkUpdate' will is called
User.beforeBulkUpdate((options: any) => {
	if (options.attributes.password)
		options.attributes.password = hashUserPassword(
			options.attributes.password
		);

	// this will change refreshTokenSalt only if I explicitly create 'refreshTokenSalt' (with any truthy value) attribute in model.update() method. I don't want 'refreshTokenSalt' to be changed every time because by changing it user would get logged out.
	if (options.attributes.refreshTokenSalt)
		options.attributes.refreshTokenSalt = createRefreshTokenSalt();
});

function hashUserPassword(password: string): string {
	return hashString(password);
}
function createRefreshTokenSalt() {
	return randomString(20);
}

Tenant.belongsTo(User);
User.hasOne(Tenant);

export default User;
