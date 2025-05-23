import validator from "validator";
import type { Request, Response, NextFunction } from "express";
// import type { CustomRequest } from "./../../digitalniweb-types/express";

export default async (req: Request, res: Response, next: NextFunction) => {
	const skipGetURLsStarting = [
		"_nuxt",
		"__webpack_hmr",
		"css",
		"images",
		"img",
		"files",
	];
	const skipGetURL = skipGetURLsStarting.some(function (url) {
		let regex = new RegExp("^/" + url);
		return regex.test(req.path);
	});
	if (skipGetURL && req.method === "GET") {
		next();
		return;
	}

	// Accept-Language: en-US, en;q=0.9, de;q=0.7, *;q=0.5
	// or
	// Accept-Language: en
	let headerLanguage: string | string[] =
		req.headers["accept-language"] ?? process.env.DEFAULT_LANGUAGE ?? "en";
	headerLanguage = headerLanguage?.split(";")[0].split(",");
	headerLanguage =
		headerLanguage?.length == 2 ? headerLanguage[1] : headerLanguage[0];
	headerLanguage = headerLanguage.trim();
	res.locals.lang = {
		header: headerLanguage, // this is mutation's language gotten from HEADERS (used for front end (web, admin) GET requests)
		code: req?.query?.lang || req?.body?.lang || headerLanguage, // this is language of requested back end data (i.e. API calls, or I can use 'en' admin and want to be able to change (or get, delete,...) 'cs' data)
		languageId: Number.parseInt(req?.body?.languageId) || null, // only if sent in request. It is the res.locals.lang.code's languageId
	};
	res.locals.lang.code = res.locals.lang.code.trim();
	if (
		!validator.isLocale(res.locals.lang.header) ||
		!validator.isLocale(res.locals.lang.code)
	)
		throw new Error("There is no such a language.");
	next();
};
