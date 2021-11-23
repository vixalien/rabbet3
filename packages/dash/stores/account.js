import create from "zustand";
import produce from "immer";

import v from "lib/validate";
import Unfreeze from "lib/unfreeze";

import { defaultAccount, defaultErrors, constraints } from "schemas/account";

let useAccount = create((set, get) => ({
	data: defaultAccount,
	loading: true,
	loggedIn: false,
	valid: true,
	errors: defaultErrors,
	load: () => {
		// dummy, for now.
		set({
			data: {
				displayName: "Angelo Verlain",
				username: "vixalien",
			},
			loading: false,
			loggedIn: true,
		});
	},
	update: (key) => (event) => {
		let value = event.target.value;
		return set(
			produce((account) => {
				account.data[key] = value;
				return account;
			})
		);
	},
	validate: (account) => {
		set(
			produce((account) => {
				account.valid = true;
				// validate account
				let pageErrors = v(account.data, constraints.account);
				if (pageErrors) account.valid = false;
				account.errors = pageErrors || defaultErrors;
				// check if the username is not already taken
				return account;
			})
		);
	},
}));

export default useAccount;
