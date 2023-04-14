/* import { DataTypes } from "sequelize";

import db from "../index.js";

import { mails } from "../../../digitalniweb-types/models/mails.js";

import Messages = mails.Messages;
import User from "./user.js";

const Messages = db.define<Messages>(
	"Messages",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},

		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		quota: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		messages: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		quotaUsed: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		messagesUsed: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);
Messages.belongsTo(User);
export default Messages;
 */
