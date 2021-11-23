import create from "zustand";

let useOpenable = create((set, get) => ({
	open: false,
	show: () => set({ open: true }),
	hide: () => set({ open: false }),
	toggle: () => set({ open: !get().open }),
}));

export default useOpenable;
