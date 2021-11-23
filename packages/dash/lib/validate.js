import v from "validate.js";

let customValidators = {
	regex: function (value, options, key, attributes) {
		if (!value) return false;
		// receive an array of {format:/regex/,message:"message"}
		options = [options].flat();
		for (let f in options) {
			let params = options[f];
			if (!value.match(params.format)) return params.message;
		}
	},
};

let normalizeErrors = (errors) => {
	if (!errors) return undefined;
	return Object.fromEntries(
		Object.entries(errors).map(([key, val]) => {
			return [key, val[0]];
		})
	);
};

let applyValidators = (vFn, object) => {
	for (let key in object) {
		vFn.validators[key] = object[key];
	}
};

let validate = (data, constraints) => {
	constraints.custom = constraints.custom || {};
	applyValidators(v, { ...customValidators, ...constraints.custom });
	delete constraints.custom;

	return normalizeErrors(v(data, constraints, { fullMessages: false }));
};

export default validate;
