// from https://www.section.io/engineering-education/logging-with-winston/
import { createLogger, format, transports } from "winston";

import { Request } from "express";

import { customErrorObject } from "../../digitalniweb-types/customHelpers/logger.js";

const levelFilter = (level: string) =>
	format((info) => {
		if (info.level != level) {
			return false;
		}
		return info;
	})();

const logger = createLogger({
	level: "info",
	transports: [
		new transports.File({
			filename: "logs/errors.log",
			format: format.combine(
				levelFilter("error"),
				format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
				format.align(),
				format.printf(
					(info) =>
						`${info.level}: ${[info.timestamp]}: ${info.message}`
				)
			),
		}),
		new transports.File({
			filename: "logs/info.log",
			format: format.combine(
				levelFilter("info"),
				format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
				format.align(),
				format.printf(
					(info) =>
						`${info.level}: ${[info.timestamp]}: ${info.message}`
				)
			),
		}),
		new transports.File({
			filename: "logs/warn.log",
			format: format.combine(
				levelFilter("warn"),
				format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
				format.align(),
				format.printf(
					(info) =>
						`${info.level}: ${[info.timestamp]}: ${info.message}`
				)
			),
		}),
	],
});

const customBELogger = function (
	customErrorObject: customErrorObject,
	req: Request | false = false
) {
	// customErrorObject = {error, code, message, data} // error = JS error, code and message are custom, data is object with additional data which will be appended to response. Everything is optional
	// req = http request or false
	let defaultErrorCode = 500;
	let errorCode =
		customErrorObject?.code ||
		customErrorObject?.error?.code ||
		defaultErrorCode;
	let errorMessage =
		customErrorObject?.message ||
		customErrorObject?.error?.message ||
		"Something went wrong";

	let responseObject = {
		message: errorMessage,
	};
	let errorDataStringified = "";
	if ("data" in customErrorObject) {
		responseObject = { ...responseObject, ...customErrorObject.data };
		errorDataStringified = "- " + JSON.stringify(customErrorObject.data);
	}
	let requestInfo = "";
	if (req) {
		requestInfo = `- ${req.originalUrl} - ${req.method} - ${req.ip}`;
	}
	if (process.env.NODE_ENV !== "development") {
		// it is not good practice to use console.log() in production because of performance. We should use some logging library
		if (typeof errorCode === "string") {
			logger.info(
				`${errorCode} - ${errorMessage} - ${requestInfo} ${errorDataStringified}`
			);
		} else if (errorCode >= 500)
			logger.error(
				`${errorCode} - ${errorMessage} ${requestInfo} ${errorDataStringified}`
			);
		else
			logger.info(
				`${errorCode} - ${errorMessage} - ${requestInfo} ${errorDataStringified}`
			);
	} else {
		console.log(customErrorObject);
	}

	if (typeof errorCode === "string") errorCode = defaultErrorCode;
	return { errorCode, responseObject };
};

export { customBELogger, logger };
