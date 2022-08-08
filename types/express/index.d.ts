type requestLanguageExpansion = {
	header: string;
	code: string;
	languageId: number | null;
};

type requestAntispamExpansion = {
	loginAttempt: any;
	loginAttemptsCount: any;
	maxLoginAttempts: any;
};

/* export interface CustomRequest extends Request {
	lang?: requestLanguageExpansion;
	antispam?: requestAntispamExpansion;
} */
declare namespace Express {
	export interface Request {
		lang?: requestLanguageExpansion;
		antispam?: requestAntispamExpansion;
	}
}
