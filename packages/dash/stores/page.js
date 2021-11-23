import create from "zustand";
import produce from "immer";

import v from "lib/validate";
import Unfreeze from "lib/unfreeze";

import {
	defaultPage,
	defaultLink,
	defaultErrors,
	constraints,
} from "schemas/page";

// helpers
function arraymove(arr, fromIndex, toIndex) {
	arr = arr.slice(0);
	var element = arr[fromIndex];
	arr.splice(fromIndex, 1);
	arr.splice(toIndex, 0, element);
	return arr;
}

const toDataURL = (url) =>
	fetch(url)
		.then((response) => response.blob())
		.then(
			(blob) =>
				new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onloadend = () => resolve(reader.result);
					reader.onerror = reject;
					reader.readAsDataURL(blob);
				})
		);

let getURLDimensions = (src) =>
	new Promise((res, rej) => {
		try {
			let image = new Image();
			let timeout = setTimeout(() => rej("loading timed out"), 3000);
			image.onload = () => {
				clearTimeout(timeout);
				res([image.width, image.height]);
			};
			image.onerror = () => {
				clearTimeout(timeout);
				rej("an error occured while trying to load the image");
			};
			image.src = src;
		} catch {
			rej("an internal error occured");
		}
	});

const usePage = create((set, get) => ({
	data: defaultPage,
	errors: defaultErrors,
	valid: false,
	actions: {
		addLink: () => {
			return set(
				produce((page) => {
					let newLinks = [...page.data.links];
					newLinks.push(defaultLink);
					page.data.links = newLinks;
					return page;
				})
			);
		},
		deleteLink: (index) => {
			return set(
				produce((page) => {
					let newLinks = [...page.data.links];
					newLinks = newLinks.filter((link, id) => id != index);
					page.data.links = newLinks;
					return page;
				})
			);
		},
		moveLinkUp: (index) => {
			return set(
				produce((page) => {
					page.data.links = arraymove(page.data.links, index, index - 1);
					return page;
				})
			);
		},
		moveLinkDown: (index) => {
			return set(
				produce((page) => {
					page.data.links = arraymove(page.data.links, index, index + 1);
					return page;
				})
			);
		},
		handleChange: (key) => (event) =>
			set(
				produce((page) => {
					page.data[key] = event.target.value;
				})
			),
		handleLinkChange: (index, key) => (event) =>
			set(
				produce((page) => {
					page.data.links[index][key] = event.target.value;
					return page;
				})
			),
		handleHeroTypeChange: () => (event) =>
			set(
				produce((page) => {
					console.log("hero type", event.target.value);
					page.data.hero.type = event.target.value;
				})
			),
		handleHeroChange: (key) => async (event) => {
			try {
				if (key == "yembed") {
					return set(
						produce((page) => {
							page.data.hero = {
								type: "yembed",
								value: event.target.value,
							};
							return page;
						})
					);
				} else if (key == "image") {
					let file = event.target.files[0];
					if (!file) return;
					let url = URL.createObjectURL(file);
					let dimensions = await getURLDimensions(url).catch(() => [0, 0]);
					return set(
						produce((page) => {
							page.data.hero = {
								type: "image",
								value: {
									_meta: {
										type: file.type,
										size: file.size,
										dimensions: dimensions,
										objectURL: url,
									},
									file: file,
								},
							};
							return page;
						})
					);
				} else {
					return set(
						produce((page) => {
							page.data.hero = {
								type: "none",
								value: "",
							};
							return page;
						})
					);
				}
			} finally {
				get().actions.validate();
			}
		},
		validate: () => {
			return set(
				produce((page) => {
					page.valid = true;
					// validate page
					let pageErrors = v(page.data, constraints.page);
					if (pageErrors) page.valid = false;
					page.errors = pageErrors || defaultErrors;
					page.errors = Unfreeze(page.errors);
					// validate hero
					let pageHeroErrors = v(page.data.hero, constraints.hero);
					if (pageHeroErrors) page.valid = false;
					page.errors.hero = pageHeroErrors || {};
					page.errors.hero = Unfreeze(page.errors.hero);
					// validate links
					page.errors.links = [];
					page.data.links.forEach((link, index) => {
						let linkErrors = v(link, constraints.link);
						if (linkErrors) page.valid = false;
						page.errors.links[index] = linkErrors || {};
					});
					return page;
				})
			);
		},
		setData: (data) => {
			return set(
				produce((page) => {
					page.data = data;
					return page;
				})
			);
		},
	},
}));

export default usePage;
