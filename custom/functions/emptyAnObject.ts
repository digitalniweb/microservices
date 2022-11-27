export default function emptyAnObject(object: Object) {
    for (let property in object) if (object.hasOwnProperty(property)) delete object[property];
}