export default function isArray(
	variable: any,
): boolean {
	return variable !== undefined && variable.constructor === Array;
}
