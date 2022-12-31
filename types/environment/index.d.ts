import { microservices } from "../index.js";
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			MICROSERVICE_NAME: microservices;
			MICROSERVICE_UNIQUE_NAME: string;
			MICROSERVICE_API_KEY: string;

			HOST: string;
			PORT: number;

			DB_HOST?: string;
			DB_USER?: string;
			DB_PASSWORD?: string;
			DB_NAME?: string;
			DB_DRIVER?: string;

			DEFAULT_LANGUAGE?: string;

			NODE_ENV: "development" | "production";
		}
	}
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
