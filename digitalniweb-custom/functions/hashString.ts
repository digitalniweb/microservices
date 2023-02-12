import crypto from "node:crypto";
export function hashString(string: string, algorithm: string = "sha512") {
	return crypto.createHash(algorithm).update(string, "utf8").digest("base64");
}
