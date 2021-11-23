import { useEffect } from "react";

import Link from "components/link";
import Input from "components/input";
import Header from "components/header";
import Button from "components/button";

import useAccount from "stores/account";

import toast from "lib/toast";

let AccountPage = () => {
	let account = useAccount();

	useEffect(() => {
		account.validate();
	}, [JSON.stringify(account.data)]);

	let validateThenSave = (event) => {
		event.preventDefault();
		account.validate();
		if (account.valid) {
			// onsave
			console.log(account);
		} else {
			toast.error(
				"Account data is invalid. Please fix all errors before saving"
			);
		}
	};

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
						value={account.data.displayName}
						onChange={account.update("displayName")}
						error={account.errors.displayName}
					/>
					<Input
						label="Username"
						value={account.data.username}
						onChange={account.update("username")}
						error={account.errors.username}
					/>
				</div>
				<div>
					<Button onClick={validateThenSave}>Save</Button>{" "}
					<Button delete>Log out</Button>
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
