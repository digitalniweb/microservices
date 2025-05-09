import express from "express";
import type { Express, ErrorRequestHandler } from "express";

import languageSetter from "./middleware/language-setter.js";

import {
	consoleLogProduction,
	logErrorRoute,
} from "./../digitalniweb-custom/helpers/logger.js";

import type { logObject } from "../digitalniweb-types/logger.js";
import type { errorResponse } from "../digitalniweb-types/errors.js";

import apiRoutes from "./api/index.js";

import serverInit from "./serverInit/index.js";
import type { SqlError } from "mariadb";
import isObjectEmpty from "../digitalniweb-custom/functions/isObjectEmpty.js";
import { getUTCDateTime } from "../digitalniweb-custom/functions/dateFunctions.js";

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

	app.use(<ErrorRequestHandler>((error: any, req, res, next) => {
		// in express middleware throw error in catch block instead of next({}: any});

		let data = {} as any;
		let messageTranslate: undefined | string;

		if (error?.original?.name == "SqlError") {
			// when validation or uniqueness in DB is broken
			// if (error.errors && error.errors[0]?.path === "unique_email_per_website") {...} // <- unique_email_per_website is name of 'uniqueKeys' defined in migration

			let errors = error?.errors?.reduce(
				(accumulator: any, currentObject: any) => {
					accumulator[currentObject.path] = currentObject.message;
					return accumulator;
				},
				{}
			);

			if (error.name === "SequelizeUniqueConstraintError") {
				if ((error?.original as SqlError)?.code === "ER_DUP_ENTRY") {
					if (errors.unique_email_per_website)
						messageTranslate = "errorUniqueEmail";
					else if (errors.unique_nickname_per_website)
						messageTranslate = "errorUniqueNickname";
					else messageTranslate = "errorUnique";
				}
			}
		}

		let statusCode =
			error.statusCode ??
			(typeof error.statusCode == "number" ? error.statusCode : 500);
		let message = error.message ?? "Something went wrong";
		let code;
		if (error.code || error.original.code)
			code = error.code ?? error.original.code;

		let logObject = {
			req: {
				url: req.originalUrl,
				method: req.method,
			},
			error: {
				statusCode,
				message,
			},
			callee: {},
			time: getUTCDateTime(),
		} as logObject;

		if (process.env.APP_ID) {
			logObject.callee.serviceType = "app";
			logObject.callee.serviceId = process.env.APP_ID;
		} else if (process.env.MICROSERVICE_ID) {
			logObject.callee.serviceType = "microservice";
			logObject.callee.serviceId = process.env.MICROSERVICE_ID;
		}

		if (req.query) logObject.req.query = req.query;
		if (req.params) logObject.req.params = req.params;
		if (code) logObject.error!.code = code;
		if (req.ip) {
			if (!logObject.caller) logObject.caller = {};
			logObject.caller.ip = req.ip;
		}
		if (req.body) {
			let bodyCopy = structuredClone(req.body);
			if (bodyCopy?.password) bodyCopy.password = "ANONYMIZED";
			else if (bodyCopy?.user?.password)
				bodyCopy.user.password = "ANONYMIZED";

			logObject.req.body = bodyCopy;
			if (bodyCopy.resourceIds) {
				if (!logObject.caller) logObject.caller = {};
				logObject.caller.resourceIds = bodyCopy.resourceIds;
				delete bodyCopy.resourceIds;
			}
			if (bodyCopy.ua) {
				if (!logObject.caller) logObject.caller = {};
				logObject.caller.ua = bodyCopy.ua;
				delete bodyCopy.ua;
			}
		}

		let errorResponse: errorResponse = {
			message,
			statusCode,
		};

		if (error?.name) errorResponse.name = error.name;
		if (code) errorResponse.code = code;

		if (!isObjectEmpty(data)) errorResponse.data = data;

		if (messageTranslate) errorResponse.messageTranslate = messageTranslate;

		logErrorRoute(logObject);

		res.status(statusCode).send(errorResponse);
	}));

	const port = process.env.PORT;
	if (port === undefined) throw new Error("You haven't specified port!");

	app.listen(port, () => {
		console.log(`Server is running at http://localhost:${port}`);
	});
} catch (error: any) {
	consoleLogProduction(error, "error", "Server execution terminated.");
}
