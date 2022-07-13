import express, { Express, ErrorRequestHandler } from "express";
import dotenv from "dotenv";

import { apiRoutes } from "./api";

dotenv.config();

const app: Express = express();
//so we can use req.body in POST methods to get posted parameters (e.g. req.body.name)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/", apiRoutes);

app.use(<ErrorRequestHandler>((err, req, res, next) => {
	// in express middleware throw error in catch block: next({ error, code: 500, message: "Can't load api" });
	/* let { errorCode, responseObject } = customBELogger(err, req);
	return res.status(errorCode).send(responseObject); */
	return res.status(500).send({ message: err });
}));

const port = process.env.PORT;
app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
