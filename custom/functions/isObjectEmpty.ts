export default function isObjectEmpty(
	obj: Object,
) {
	return obj.constructor === Object && Object.keys(obj).length === 0;
}
