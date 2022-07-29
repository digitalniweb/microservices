export default function isObjectEmpty(
	obj: Object,
	canBeArray: boolean = false
) {
	if (canBeArray == true)
		return (
			Object.keys(obj).length === 0 &&
			(obj.constructor === Object || obj.constructor === Array)
		);
	return Object.keys(obj).length === 0 && obj.constructor === Object;
}
