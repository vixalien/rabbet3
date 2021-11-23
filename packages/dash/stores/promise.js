import create from "zustand";

let usePromise = create((set, get) => ({
	loading: true,
	threw: null,
	value: null,
	onResolve: (a) => {},
	finally: (fn) => set({ finalCb: fn }),
	use: (promise) => {
		return promise
			.then((data) => {
				set({ loading: false, threw: false, value: data });
				return data;
			})
			.catch((data) => {
				set({ loading: false, threw: true, value: data });
				return data;
			})
			.finally(get().onResolve);
	},
	set: (data) => set(data),
}));

export default usePromise;
