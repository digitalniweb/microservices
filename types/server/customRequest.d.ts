import { Request } from "express";
type requestLanguageExpansion = {
	header: string;
	code: string;
	languageId: number | null;
};

type requestAntispam = {
	loginAttempt: any;
	loginAttemptsCount: any;
	maxLoginAttempts: any;
};

export interface CustomRequest extends Request {
	lang?: requestLanguageExpansion;
	antispam?: requestAntispam;
}
