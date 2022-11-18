import { argv, env, exit } from 'node:process';
import dotenv from "dotenv";
import { copyFile } from 'node:fs';

class changeService {
    newService: string | undefined;
    currentService: string | undefined;
    folder = 'service_configs/';
    envVar= 'MICROSERVICE_NAME';

    constructor() {
        dotenv.config();
        let flags = argv.slice(2);
        if(flags.length == 0)
            throw `You have to set service name witch to switch to.`;

        this.newService = flags[0];
        this.currentService = env[this.envVar];

        if(this.currentService === undefined)
            throw `${this.envVar} in .env is undefined.`;

        if(this.currentService == this.newService)
            throw `Current service name in .env is the same as service name you want to switch to.`;

        this.copyFileToFolder('.env');
        this.copyFileToFolder('package.json');
        this.copyFileToFolder('package-lock.json');
        
        this.copyFileFromFolder('.env');
        this.copyFileFromFolder('package.json');
        this.copyFileFromFolder('package-lock.json');
    }

    copyFileToFolder(file: string) {
        let newFileName = file + '_' + this.currentService
        copyFile(file, this.folder + newFileName, 0, (err) => {
            if(err) throw err; 
            console.log(`${file} file copied to ${this.folder} as ${newFileName}.`);        
        });
    }

    copyFileFromFolder(file: string) {
        let newFileName = file + '_' + this.newService
        copyFile(this.folder + newFileName, file, 0, (err) => {
            if(err) throw err; 
            console.log(`${newFileName} file copied from ${this.folder} as ${file}.`);        
        });
    }
}

new changeService();
