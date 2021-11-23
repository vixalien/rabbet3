// validators
let constraints = {
	account: {
		displayName: {
			presence: { allowEmpty: false },
			length: {
				minimum: 5,
				maximum: 30,
			},
			regex: [
				{
					format: /^[A-Za-z]/,
					message: "must start with a letter",
				},
				{
					format: /^([A-Za-z1-3\ ]*)$/,
					message: "can only contain letters, numbers and spaces",
				},
			],
		},
		username: {
			presence: { allowEmpty: false },
			length: {
				minimum: 3,
				maximum: 40,
			},
			exclusion: [
				"rabbet",
				"rabbet3",
				"dash",
				"db",
				"pages",
				"hyper",
				"r",
				"redir",
				"index",
				"dns",
			],
			regex: [
				{
					format: /^[A-Za-z0-9]/,
					message: "must start with a letter or a number",
				},
				{
					format: /^([A-Za-z0-9-_]*)$/,
					message: "can only contain _, -, numbers and letters only",
				},
			],
		},
	},
};

let defaultAccount = {
	displayName: "",
	username: "",
};

let defaultErrors = {};

export { constraints, defaultAccount, defaultErrors };
