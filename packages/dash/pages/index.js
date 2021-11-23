import { useRouter } from "next/router";

import useAccount from "stores/account";

import HomePage from "./home";

export default function Home() {
	let account = useAccount();
	let router = useRouter();

	if (account.loggedIn) {
		router.push("/account");
		return "";
	}
	return <HomePage />;
}
