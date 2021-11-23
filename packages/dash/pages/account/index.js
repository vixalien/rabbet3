import { useEffect } from "react";

import { logout } from "@rabbet/db/account";

import Link from "components/link";
import Input from "components/input";
import Header from "components/header";
import Button from "components/button";

import useAccount, { useEditableAccount } from "stores/account";

import validateThenSave from "lib/validate-then-save";

let AccountPage = () => {
	let account = useAccount();
	let editableAccount = useEditableAccount();

	useEffect(() => {
		editableAccount.init(account.data);
	}, []);

	useEffect(() => {
		editableAccount.validate();
	}, [JSON.stringify(editableAccount.current)]);

	useEffect(() => {
		editableAccount.setAccountData(account.data);
	}, [JSON.stringify(account.data)]);

	let saveToDB = validateThenSave({
		store: editableAccount,
		staticStore: account,
		useStore: useEditableAccount,
		validate: () => editableAccount.validateAll(),
		name: "Account",
		changed: (current, data) => {
			return (current.displayName != data.displayName ||
				current.username != data.username);
		},
		DB_NAME: "users",
		updateStore: data => account.actions.setData(data),
	});

	return (
		<main>
			<Header
				title={{
					text: "Account",
				}}
				active="account"
			/>
			<form>
				<h3>Account details</h3>
				<div>
					<Input
						label="Display name"
						value={editableAccount.current.displayName}
						onChange={editableAccount.update("displayName")}
						error={editableAccount.errors.displayName}
					/>
					<Input
						label="Username"
						value={editableAccount.current.username}
						onChange={editableAccount.update("username")}
						error={editableAccount.errors.username}
					/>
				</div>
				<div>
					<Button onClick={saveToDB}>Save</Button>{" "}
					<Button
						delete
						onClick={(e) => {
							e.preventDefault();
							logout();
						}}
					>
						Log out
					</Button>
				</div>
				<br />
				<div>
					<details>
						<summary>Advanced settings</summary>
						<div>
							<h4>Delete account</h4>
							<p>
								Note: If you delete account, all your data saved on Rabbet will
								be permanently deleted immediately, including pages, analytics
								and other data linked to you.
							</p>
							<Button delete>Delete account</Button>
						</div>
					</details>
				</div>
			</form>
		</main>
	);
};

export default AccountPage;
