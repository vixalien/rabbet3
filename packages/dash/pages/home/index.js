import { login } from "@rabbet/db/account";

import Button from "components/button";

let HomePage = () => {
	if (typeof window != "undefined") {
		window.login = login;
	}
	return (
		<main>
			<div>
				<br />
				<br />
				<br />
				<h1 style={{ display: "inline-flex" }}>
					Rabbet{" "}
					<span
						className="badge"
						style={{ margin: "auto 10px", fontSize: "20px" }}
					>
						BETA
					</span>
				</h1>
				<hr />
				<div>
					<p>
						<b>EARLY ACCESS.</b>{" "}
						<span>Build a small site from links and text</span>
						<br />
						<br />
						<Button onClick={login.withGoogle}>Continue with Google</Button>
						<br />
					</p>
				</div>
				<hr />
				<br />
				<br />
				<h2>The World&apos;s simplest link aggregator</h2>
				<p>Creating a page is as easy as 1,2,3 with Rabbet.</p>
				<h3>1. Define your page</h3>
				<p>
					Show the necessary Label for your page, a slug that will affect the
					page&apos;s URL and optional text about your Page.
				</p>
				<img src="/images/home/top.svg" width="100%" />
				<h3>2. Add links</h3>
				<p>Add any links you want to be visible on your page.</p>
				<img src="/images/home/links.svg" width="100%" />
				<h3>3. Publish.</h3>
				<p>Click Save and your page is live. Immediately!</p>
				<img src="/images/home/browser.svg" width="100%" />
				<p>
					<b>&copy; Rabbet 2021</b>
				</p>
			</div>
		</main>
	);
};

export default HomePage;
