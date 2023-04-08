import { DataTypes } from "sequelize";

import db from "../index.js";

import { mails } from "../../../digitalniweb-types/models/mails.js";

import User = mails.User;

import Messages from "./messages.js";
const User = db.define<User>(
	"User",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);
User.hasOne(Messages);
export default User;
