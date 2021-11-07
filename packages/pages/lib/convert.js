// convert from JSON to Firestore document and vice versa.

let toFDOC = function (value) {
	if (!value) {
		return { nullValue: null };
	} else if (!isNaN(value)) {
		if (value.toString().indexOf(".") != -1) return { doubleValue: value };
		else return { integerValue: value };
	} else if (
		value === "true" ||
		value === "false" ||
		typeof value == "boolean"
	) {
		return { booleanValue: value };
	} else if (Date.parse(value)) {
		return { timestampValue: value };
	} else if (typeof value == "string") {
		return { stringValue: value };
	} else if (value && value.constructor === Array) {
		return { arrayValue: { values: value.map((v) => toFDOC(v)) } };
	} else if (typeof value === "object") {
		let obj = {};
		for (let o in value) {
			obj[o] = toFDOC(value[o]);
		}
		return { mapValue: { fields: obj } };
	}
};
let toPOJO = function (fields) {
	let result = {};
	for (let f in fields) {
		let key = f,
			value = fields[f],
			isDocumentType = [
				"stringValue",
				"booleanValue",
				"doubleValue",
				"integerValue",
				"timestampValue",
				"mapValue",
				"arrayValue",
				"nullValue",
			].find((t) => t === key);
		if (isDocumentType) {
			let item = [
				"stringValue",
				"booleanValue",
				"doubleValue",
				"integerValue",
				"timestampValue",
				"nullValue",
			].find((t) => t === key);
			if (item) return value;
			else if ("mapValue" == key) return toPOJO(value.fields || {});
			else if ("arrayValue" == key) {
				let list = value.values;
				return !!list ? list.map((l) => toPOJO(l)) : [];
			}
		} else if (key == "name") {
			result.name = value;
		} else if (typeof value === "string") {
			result.fields[key] = value;
		} else {
			// error
			result[key] = toPOJO(value);
		}
	}
	return result;
};

module.exports = { toPOJO, toFDOC };
