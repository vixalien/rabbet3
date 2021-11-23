import db from "@rabbet/db";

import toast from "lib/toast";

let validateThenSave = ({
		store,
		staticStore,
		useStore,
		validate,
		name,
		changed,
		DB_NAME,
		updateStore,
		onFinishSaving = () => {},
	}) => {
	return (event) => {
		// show a toast while validating staticStore
		let loadingToast = toast.loading(`Validating ${name}...`)
		event.preventDefault();
		validate().then(() => {
			let store = useStore.getState();
			toast.dismiss(loadingToast);
			if (!changed(store.current, staticStore.data)) {
				return toast.default(
					"Nothing to save: Everything is already up-to-date."
				);
			}

			if (store.valid) {
				toast.promise(
					new Promise((resolve, reject) => {
						return db
							.set(DB_NAME, staticStore.data.uid, store.current, true)
							.then(() =>
								updateStore({ ...staticStore.data, ...store.current })
							)
							.then(() => resolve("Successfully saved."))
							.then(onFinishSaving)
							.catch((error) => {
								console.log("Error: ", error);
								reject();
							});
					}),
					{
						loading: `Saving ${name}...`,
						success: "Successfully saved.",
						error:
							`An error occured while trying to save your ${name}. Are you offline?`,
					}
				);
			} else {
				return toast.error(
					`${name} data is invalid. Please fix all errors before saving`
				);
			}
		});
	};
};

let validateThenCreate = ({
		store,
		useStore,
		validate,
		name,
		changed,
		DB_NAME,
		onFinishSaving = () => {},
	}) => {
	return (event) => {
		// show a toast while validating staticStore
		let loadingToast = toast.loading(`Validating ${name}...`)
		event.preventDefault();
		validate().then(() => {
			let store = useStore.getState();
			toast.dismiss(loadingToast);

			if (store.valid) {
				toast.promise(
					new Promise((resolve, reject) => {
						return db
							.add(DB_NAME, store.current)
							.then(() => resolve("Successfully saved."))
							.then(onFinishSaving)
							.catch((error) => {
								console.log("Error: ", error);
								reject();
							});
					}),
					{
						loading: `Saving ${name}...`,
						success: "Successfully saved.",
						error:
							`An error occured while trying to save your ${name}. Are you offline?`,
					}
				);
			} else {
				return toast.error(
					`${name} data is invalid. Please fix all errors before saving`
				);
			}
		});
	};
};

export default validateThenSave;
export { validateThenCreate };