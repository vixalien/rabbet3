import { useState, useEffect } from "react";

import Link from "components/link";
import Header from "components/header";
import Button from "components/button";

import CONSTANTS from "lib/constants";

let MiniPage = ({ username, page, hr = true }) => {
	let url = CONSTANTS.LINKS.GET_PAGE(username, page.slug);
	return (
		<li>
			<h3>{page.label}</h3>
			<div>
				<b>
					<i>/{page.slug}</i>
				</b>
			</div>
			<div className="spacer" />
			<Button href={`/pages/` + page.slug}>View</Button>{" "}
			<Button href={url} target="_blank" noopener noreferrer>
				Open in new tab &#8599;
			</Button>
		</li>
	);
};

let Pages = ({ pages, username }) => {
	if (!pages || !pages.length) return "No pages created yet.";
	return (
		<ol className="pages">
			{pages.map((page, index) => {
				let data = page;
				return (
					<MiniPage
						key={data.slug || index}
						username={username}
						page={data}
						hr={index !== pages.length - 1}
					/>
				);
			})}
		</ol>
	);
};

let Dashboard = ({ currentUser }) => {
	let [pages, setPages] = useState([
		{
			label: "First Page",
			slug: "hello",
		},
		{
			label: "Test Page",
			slug: "test",
		},
		{
			label: "Hi",
			slug: "ho",
		},
	]);

	let [loading, setLoading] = useState(false);

	if (loading)
		return (
			<>
				<main>
					<Header />
					<h1>Loading...</h1>
				</main>
			</>
		);
	return (
		<>
			<main>
				<Header
					title={{
						text: "All Pages",
					}}
				/>
				<div>
					<Button
						href="/pages/new"
						disabled={pages.length >= CONSTANTS.MAX.PAGES}
					>
						New Page
					</Button>
				</div>
				{pages.length >= CONSTANTS.MAX.PAGES && (
					<>
						<br />
						<div>
							<b>Note:</b> The total number of pages must be less than $
							{CONSTANTS.MAX.PAGES}
						</div>
					</>
				)}
				<br />
				<Pages pages={pages} username={"vixalien"} />
			</main>
		</>
	);
};

export default Dashboard;
