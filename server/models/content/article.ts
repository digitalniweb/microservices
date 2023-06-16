"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { content } from "../../../digitalniweb-types/models/content.js";
import Article = content.Article;

const Article = db.define<Article>(
	"Article",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		languageId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 255],
			},
		},
		url: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				len: [1, 255],
			},
		},
		icon: {
			type: DataTypes.STRING,
			validate: {
				len: [0, 50],
			},
		},
		otherUrl: {
			type: DataTypes.STRING,
			validate: {
				len: [0, 500],
			},
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
			allowNull: false,
		},
		freeMenu: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		order: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		treeLevel: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		parentId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: null,
		},
		websiteId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING,
		},
		description: {
			type: DataTypes.STRING,
		},
		image: {
			type: DataTypes.STRING,
		},
	},
	{
		timestamps: true,
		paranoid: true,
	}
);

Article.belongsTo(Article, { as: "parent", foreignKey: "parentId" });

export default Article;
