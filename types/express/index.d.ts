import { loginAttempt } from "./../index";
type requestLanguageExpansion = {
	header: string;
	code: string;
	languageId: number | null;
};

type requestAntispamExpansion = {
	loginAttempt: loginAttempt;
	loginAttemptsCount: any;
	maxLoginAttempts: any;
};

declare namespace Express {
	export interface Request {
		lang?: requestLanguageExpansion;
		antispam?: requestAntispamExpansion;
		userVerified?: {
			id: number;
			roles: possibleRoles[];
			privileges: string[];
		};
	}
}

export as namespace Express;
export = Express;
