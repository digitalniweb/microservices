import mariadb from "mariadb";

const DB_NAME = process.env.DB_NAME;

if (!DB_NAME) {
	console.error("❌ DB_NAME is not set in .env");
	process.exit(1);
}

async function createDatabase() {
	const connection = await mariadb.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
	});

	try {
		await connection.query(
			`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
		);
		console.log(`✅ Database "${DB_NAME}" created or already exists.`);
	} catch (error) {
		console.error("❌ Failed to create database:", error);
	} finally {
		connection.end();
	}
}

await createDatabase();
