import create from "zustand";
import produce from "immer";

import db from "@rabbet/db";

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
	data: {},
	loading: true,
	actions: {
		load: (uid, slug) => {
			return db
				.query("pages", db.where("user_uid", "==", uid), db.where("slug", "==", slug))
				.then(data => (data || [])[0])
				.then(data => set({ data: { slug, ...data }, loading: false }))
		},
		delete: () => {
			let page = get();
			if (!page && !page.data && !page.data.slug) return;
			return db
				.deleteAll("pages", db.where("slug", "==", page.data.slug))
				.then(data => (data || [])[0])
				.then(data => set({ data: {}, loading: false }));
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

const useEditablePage = create((set, get) => ({
	valid: false,
	data: {},
	current: defaultPage,
	errors: defaultErrors,
	actions: {
		setData: (data) => {
			return set(
				produce((page) => {
					page.data = data;
					page.current = data;
					return page;
				})
			);
		},
		save: () => {
			let page = get();
			return db
				.set("pages", page.uid, page.current, false)
				.then(data => set({ data: { ...page.data, ...page.current } }))
		},
		addLink: () => {
			return set(
				produce((page) => {
					let newLinks = [...page.current.links];
					newLinks.push(defaultLink);
					page.current.links = newLinks;
					return page;
				})
			);
		},
		deleteLink: (index) => {
			return set(
				produce((page) => {
					let newLinks = [...page.current.links];
					newLinks = newLinks.filter((link, id) => id != index);
					page.current.links = newLinks;
					return page;
				})
			);
		},
		moveLinkUp: (index) => {
			return set(
				produce((page) => {
					page.current.links = arraymove(page.current.links, index, index - 1);
					return page;
				})
			);
		},
		moveLinkDown: (index) => {
			return set(
				produce((page) => {
					page.current.links = arraymove(page.current.links, index, index + 1);
					return page;
				})
			);
		},
		handleChange: (key) => (event) =>
			set(
				produce((page) => {
					page.current[key] = event.target.value;
				})
			),
		handleLinkChange: (index, key) => (event) =>
			set(
				produce((page) => {
					page.current.links[index][key] = event.target.value;
					return page;
				})
			),
		handleHeroTypeChange: () => (event) =>
			set(
				produce((page) => {
					page.current.hero.type = event.target.value;
					page.current.hero.value = "";
				})
			),
		handleHeroChange: (key) => async (event) => {
			try {
				if (key == "yembed") {
					return set(
						produce((page) => {
							page.current.hero = {
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
							page.current.hero = {
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
							page.current.hero = {
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
					let pageErrors = v(page.current, constraints.page);
					if (pageErrors) page.valid = false;
					page.errors = pageErrors || defaultErrors;
					page.errors = Unfreeze(page.errors);
					// validate hero
					let pageHeroErrors = v(page.current.hero, constraints.hero);
					if (pageHeroErrors) page.valid = false;
					page.errors.hero = pageHeroErrors || {};
					page.errors.hero = Unfreeze(page.errors.hero);
					// validate links
					page.errors.links = [];
					page.current.links.forEach((link, index) => {
						let linkErrors = v(link, constraints.link);
						if (linkErrors) page.valid = false;
						page.errors.links[index] = linkErrors || {};
					});
					return page;
				})
			);
		},
		validateAll: async () => {
			let page = get();
			page.actions.validate();
			// check if the slug is not already taken
			if (
				page.current.slug !=
				page.data.slug /* && (!page.errors.slug)*/
			) {
				await db
					.query("pages", db.where("slug", "==", page.current.slug))
					.then((accounts) => {
						if (accounts && accounts.length) {
							return set(
								produce((page) => {
									page.valid = false;
									page.errors.slug = "is already taken";
									return page;
								})
							);
						}
					});
			}
		},
	}
}))

export default usePage;
export { useEditablePage };
