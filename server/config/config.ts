import dotenv, { config } from "dotenv";

dotenv.config();

const configDB: any = {
	development: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		dialect: "mariadb",
		dialectOptions: {
			collation: "UTF8MB4_UNICODE_CI",
			charset: "utf8",
			multipleStatements: true,
		},
		define: {
			timestamps: false,
		},
	},
	test: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		dialect: "mariadb",
		dialectOptions: {
			collation: "UTF8MB4_UNICODE_CI",
			charset: "utf8",
			multipleStatements: true,
		},
		define: {
			timestamps: false,
		},
	},
	production: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		dialect: "mariadb",
		dialectOptions: {
			collation: "UTF8MB4_UNICODE_CI",
			charset: "utf8",
			multipleStatements: true,
		},
		logging: false,
		define: {
			timestamps: false,
		},
	},
};
export default configDB;
