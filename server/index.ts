import express, { Express, ErrorRequestHandler } from "express";

import languageSetter from "./middleware/language-setter.js";

import { log } from "./../digitalniweb-custom/helpers/logger.js";

import apiRoutes from "./api/index.js";

import serverInit from "./serverInit/index.js";
import { customLogObject } from "../digitalniweb-types/customHelpers/logger.js";

try {
	await serverInit();

	const app: Express = express();

	// so query array parameters e.g. 'ids[]' are presented as 'ids' instead
	app.set("query parser", "extended");

	// so we can use req.body in POST methods to get posted parameters (e.g. req.body.name)
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	// add header "x-msId" to all responses
	app.use((req, res, next) => {
		res.set("x-ms-id", process.env.MICROSERVICE_ID.toString());
		next();
	});

	app.use(languageSetter);

	app.use("/api/", apiRoutes);

	app.use(<ErrorRequestHandler>((err: customLogObject, req, res, next) => {
		// in express middleware throw error in catch block: next({ error, code: 500, message: "Can't load api" });
		if (!err.type) err.type = "routing";
		let responseObject = log(err, req) || {
			code: 500,
			message: "Internal Server Error",
		};

		res.status(responseObject.code).send(responseObject);
	}));

	const port = process.env.PORT;
	if (port === undefined) throw new Error("You haven't specified port!");

	app.listen(port, () => {
		console.log(`Server is running at http://localhost:${port}`);
	});
} catch (error: any) {
	log({
		type: "consoleLogProduction",
		status: "error",
		error,
		message: "Server execution terminated.",
	});
}
