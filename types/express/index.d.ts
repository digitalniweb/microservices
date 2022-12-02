import { loginAttempt } from "./../index.js";
type requestLanguageExpansion = {
	header: string;
	code: string;
	languageId: number | null;
};

type requestAntispamExpansion = {
	loginAttempt: loginAttempt;
	loginAttemptsCount: number;
	maxLoginAttempts: number;
};

declare global {
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
}

export as namespace Express;
export default Express;
