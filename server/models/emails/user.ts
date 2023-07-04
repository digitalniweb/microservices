"use strict";
import { DataTypes } from "sequelize";

import db from "../index.js";

import { emails } from "../../../digitalniweb-types/models/emails.js";

import User = emails.User;

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

        blalba: [],
    },
    {
        timestamps: false, // createdAt, updatedAt
        paranoid: false, // deletedAt
    }
);
export default User;
