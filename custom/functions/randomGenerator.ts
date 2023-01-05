import crypto from "crypto";
/**
 *
 * @param length 1-1024
 * @param specialCharacters false = only [a-zA-Z0-9_]
 * @returns random string of `length` or empty string
 */
export function randomString(
	length: number = 64,
	specialCharacters: boolean = true
): string {
	if (length < 1 || length > 1024) return "";
	let randomString = crypto.randomBytes(length).toString("base64");
	if (specialCharacters === false)
		randomString = randomString.replace(/[^\w]/g, "");
	randomString = randomString.slice(0, length).padEnd(length, "0");
	return randomString;
}

/**
 *	Max safe integer in javascript is 9007199254740991, therefore maximum safe `length` is only 15.
 *
 *  @param length length of output integer. 1-15
 *	@returns integer of `length` or 0
 */
export function randomNumberOfLength(length: number = 10): number {
	if (length > 15 || length < 1) return 0;
	let random: string | number = Math.random().toString().slice(2);
	random = random.slice(0, length).padEnd(length, "0");
	random = parseInt(random);
	return random;
}
