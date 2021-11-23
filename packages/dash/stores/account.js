import create from "zustand";
import produce from "immer";

import db from "@rabbet/db";

import v from "lib/validate";
import Unfreeze from "lib/unfreeze";

import { defaultAccount, defaultErrors, constraints } from "schemas/account";

let useAccount = create((set, get) => ({
	data: defaultAccount,
	loading: true,
	loggedIn: false,
	watchingUser: false,
	load: async () => {
		let account = get();
		// set up watching user;
		// if (!account.watchingUser) {
		if (true) {
			db.onCurrentUserChange((user) => {
				return set({
					data: user,
					loading: false,
					loggedIn: !!user,
				});
			});
			set({
				watchingUser: true,
			});
		}
		// let user = null;
		// db.getCurrentUser()
		// 	.then(data => user = data)
		// 	.then(data => user = data)
		// 	.finally(() => {
		// 		return set({
		// 			data: user,
		// 			loading: false,
		// 			loggedIn: !!user,
		// 		});
		// 	});
	},
	setData: (data) => {
		return set({ data });
	},
}));

let useEditableAccount = create((set, get) => ({
	current: {},
	account_data: {},
	available: false,
	valid: true,
	errors: defaultErrors,
	setAccountData: (current) => {
		return set({ current, account_data: current });
	},
	setData: (current) => {
		return set({ current });
	},
	init: (account) => {
		let editable = get();
		editable.setData({
			displayName: account.displayName,
			username: account.username,
		});
	},
	update: (key) => (event) => {
		let value = event.target.value;
		return set(
			produce((account) => {
				account.current[key] = value;
				return account;
			})
		);
	},
	validate: () => {
		set(
			produce((account) => {
				account.valid = true;
				// validate account
				let pageErrors = v(account.current, constraints.account);
				if (pageErrors) account.valid = false;
				account.errors = pageErrors || defaultErrors;
				// check if the username is not already taken
				return account;
			})
		);
	},
	validateAll: async () => {
		let account = get();
		account.validate();
		// check if the username is not already taken
		if (
			account.current.username !=
			account.account_data.username /* && (!account.errors.username)*/
		) {
			await db
				.query("users", db.where("username", "==", account.current.username))
				.then((accounts) => {
					if (accounts && accounts.length) {
						return set(
							produce((account) => {
								account.valid = false;
								account.errors.username = "is already taken";
								return account;
							})
						);
					}
				});
		}
	},
}));

export default useAccount;
export { useEditableAccount };
