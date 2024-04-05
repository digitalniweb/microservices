import { argv, env, exit } from "node:process";
import dotenv from "dotenv";
import { copyFile } from "node:fs/promises";

class ChangeService {
	newService: string | undefined;
	currentService: string | undefined;
	folder = "service_configs/";
	envVar = "MICROSERVICE_NAME";

	constructor() {
		dotenv.config();
		let flags = argv.slice(2);
		if (flags.length == 0)
			throw `You have to set service name witch to switch to.`;

		this.newService = flags[0];
		this.currentService = env[this.envVar];

		if (this.currentService === undefined)
			throw `${this.envVar} in .env is undefined.`;

		if (this.currentService == this.newService)
			throw `Current service name in .env is the same as service name you want to switch to.`;
	}

	async copyFiles() {
		await this.copyFileToFolder(".env");
		await this.copyFileToFolder("package.json");
		await this.copyFileToFolder("package-lock.json");

		await this.copyFileFromFolder(".env");
		await this.copyFileFromFolder("package.json");
		await this.copyFileFromFolder("package-lock.json");
	}

	async copyFileToFolder(file: string) {
		let newFileName = file + "_" + this.currentService;
		try {
			await copyFile(file, this.folder + newFileName, 0);
			console.log(
				`${file} file copied to ${this.folder} as ${newFileName}.`
			);
		} catch (error) {
			console.log(error);
		}
	}

	async copyFileFromFolder(file: string) {
		let newFileName = file + "_" + this.newService;
		try {
			await copyFile(this.folder + newFileName, file, 0);
			console.log(
				`${newFileName} file copied from ${this.folder} as ${file}.`
			);
		} catch (error) {
			console.log(error);
		}
	}
}

let changeService = new ChangeService();
await changeService.copyFiles();
