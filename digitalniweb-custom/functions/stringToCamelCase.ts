export default function stringToCamelCase(string: string, capitalize = false): string {
	// regex for camelCase / CamelCase from kebab-case or spaced text
	let regexPattern = capitalize ? "^(.)|" : "";
	regexPattern += "[\\s-](.)";
	let regex = new RegExp(regexPattern, "g");
	return string.replace(regex, (match) =>
		match[1] !== undefined ? match[1].toUpperCase() : match[0].toUpperCase()
	);
}
