import create from "zustand";
import db from "@rabbet/db";

let usePages = create((set, get) => ({
	loading: true,
	data: null,
	load: (user) => {
		return db
			.query("pages", db.where("user_uid", "==", user.uid))
			.then((data) => set({ data }))
			.catch((data) => set({ data: data || [] }))
			.finally(() => set({ loading: false }));
	},
}));

export default usePages;
