import express, { Express, ErrorRequestHandler } from "express";
import dotenv from "dotenv";

import apiRoutesWebsites from "./api/websites";
import apiRoutesUsers from "./api/users";

import languageSetter from "./middleware/language-setter";

import { customBELogger } from "./../custom/helpers/logger";

import serverInit from "./serverInit/index";
serverInit();

dotenv.config();

const app: Express = express();

//so we can use req.body in POST methods to get posted parameters (e.g. req.body.name)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(languageSetter);

if (process.env.MICROSERVICE_NAME == "websites")
	app.use("/api/", apiRoutesWebsites);
else if (process.env.MICROSERVICE_NAME == "users")
	app.use("/api/", apiRoutesUsers);

app.use(<ErrorRequestHandler>((err, req, res, next) => {
	// in express middleware throw error in catch block: next({ error, code: 500, message: "Can't load api" });
	let { errorCode, responseObject } = customBELogger(err, req);
	return res.status(errorCode).send(responseObject);
}));

const port = process.env.PORT;
app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
