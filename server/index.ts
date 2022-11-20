import express, { Express, ErrorRequestHandler } from "express";
import dotenv from "dotenv";

import languageSetter from "./middleware/language-setter";

import { customBELogger } from "./../custom/helpers/logger";

import apiRoutes from "./api/";

import serverInit from "./serverInit/index";
serverInit();

dotenv.config();

const app: Express = express();

//so we can use req.body in POST methods to get posted parameters (e.g. req.body.name)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(languageSetter);

app.use("/api/", apiRoutes);


app.use(<ErrorRequestHandler>((err, req, res, next) => {
	// in express middleware throw error in catch block: next({ error, code: 500, message: "Can't load api" });
	let { errorCode, responseObject } = customBELogger(err, req);
	return res.status(errorCode).send(responseObject);
}));

const port = process.env.PORT;
if (port)
	app.listen(port, () => {
		console.log(`Server is running at http://localhost:${ port }`);
	});
else {
	console.log(`You haven't spicified port!`);
}
