import { v4 } from "uuid";

import CONSTANTS from "lib/constants";

// validators
let constraints = {
	page: {
		label: {
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
		slug: {
			presence: { allowEmpty: false },
			length: {
				minimum: 3,
				maximum: 40,
			},
			exclusion: CONSTANTS.RESTRICTED_SLUGS,
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
		about: {
			length: {
				maximum: 500,
			},
		},
		links_no: {
			maxLinks: CONSTANTS.MAX.LINKS,
		},
		custom: {
			maxLinks(value, options, key, attributes) {
				if (attributes.links.length >= options)
					return `must be less than ${options}`;
			},
		},
	},
	hero: {
		value: {
			heroValidator: true,
		},
		custom: {
			heroValidator(value, options, key, attributes) {
				if (!attributes.type || attributes.type == "none") {
					return null;
				} else if (attributes.type == "yembed") {
					if (!value) {
						return "is empty";
					} else if (
						typeof value != "string" ||
						!value.match(/^[A-Za-z0-9_-]{11}$/)
					) {
						return "is not a valid YouTube Video ID";
					}
				} else if (attributes.type == "image") {
					if (typeof value != "object") {
						return "is empty";
					} else if (value._meta.size > 3145728) {
						return "is larger than 3 mb";
					} else if (
						!["image/gif", "image/png", "image/jpeg", "image/svg+xml"].includes(
							value._meta.type
						)
					) {
						return "is not of PNG, JPG, SVG or GIF format";
					} else if (value._meta.dimensions[0] != value._meta.dimensions[1]) {
						return "is not squared (of 1:1 ratio)";
					} else if (value._meta.dimensions[0] < 100) {
						return "is not a high-resolution image (more than 100px in width)";
					}
				}
			},
		},
	},
	link: {
		label: {
			presence: { allowEmpty: false },
			length: {
				minimum: 3,
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
		url: {
			presence: { allowEmpty: false },
			regex: [
				{
					format:
						/^([a-z][a-z0-9\*\-\.]*):(\/\/)?(?:(?:(?:[\w\.\-\+!$&'\(\)*\+,;=]|%[0-9a-f]{2})+:)*(?:[\w\.\-\+%!$&'\(\)*\+,;=]|%[0-9a-f]{2})+@)?(?:(?:[a-z0-9\-\.]|%[0-9a-f]{2})+|(?:\[(?:[0-9a-f]{0,4}:)*(?:[0-9a-f]{0,4})\]))(?::[0-9]+)?(?:[\/|\?](?:[\w#!:\.\?\+=&@!$'~*,;\/\(\)\[\]\-]|%[0-9a-f]{2})*)?$/i,
					message:
						"is not a valid url. Must be in format: https://example.com/hello",
				},
			],
		},
	},
};

// defaults
let defaultLink = {
	label: "",
	url: "",
};

let defaultLinks = [defaultLink];

let defaultPage = {
	label: "",
	slug: v4(),
	about: "Write a short text to show to visitors of your page (Not Required)",
	links: defaultLinks,
	hero: {
		type: "none",
		value: "",
	},
};

let defaultErrors = {
	hero: {},
	links: [],
};

export { constraints, defaultPage, defaultLink, defaultErrors };
