import crypto from "crypto";
export function randomString(
	length: number = 64,
	specialCharacters: boolean = true
): string {
	let randomString = crypto.randomBytes(length).toString("base64");
	if (specialCharacters === false)
		randomString = randomString.replace(/[^\w]/g, "");
	randomString = randomString.slice(0, length).padEnd(length, "0");
	return randomString;
}

/**
 * // max safe integer is 9007199254740991
 *  @param length length of output integer. 1-15
 *	@returns integer | false
 */
export function randomNumberOfLength(length: number = 10): number | false {
	if (length > 15 || length < 1) return false;
	let random: string | number = Math.random().toString().slice(2);
	random = random.slice(0, length).padEnd(length, "0");
	random = parseInt(random);
	return random;
}
