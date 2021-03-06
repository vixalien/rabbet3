import Head from "next/head";
import { useEffect } from "react";

import "public/app.css";

import initApp from "@rabbet/db/init";
import Header from "components/header";
import HomePage from "./home";

import { ToastComponent } from "lib/toast";
import useAccount from "stores/account";

let Loading = ({ account, children }) => {
	if (account.loading) {
		return (
			<>
				<main>
					<Header
						title={{
							text: "Loading...",
						}}
						showNav={false}
					/>
				</main>
			</>
		);
	}

	if (!account.loggedIn) {
		return <HomePage />;
	}

	return children;
};

function MyApp({ Component, pageProps }) {
	initApp();
	let account = useAccount();

	useEffect(() => {
		account.load();
	}, []);

	return (
		<>
			<Head>
				<title>Rabbet</title>
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<link rel="shortcut icon" href="/favicon.ico" />
				<link rel="manifest" href="/manifest.json"/>
			</Head>
			<ToastComponent />
			<Loading account={account}>
				<Component {...pageProps} />
			</Loading>
		</>
	);
}

export default MyApp;
