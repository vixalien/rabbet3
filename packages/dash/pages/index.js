import { useRouter } from "next/router";

import useAccount from "stores/account";

import HomePage from "./home";

export default function Home() {
	let account = useAccount();
	if (account.loggedIn) {
		let router = useRouter();
		router.push("/account");
		return "";
	}
	return <HomePage />;
}
