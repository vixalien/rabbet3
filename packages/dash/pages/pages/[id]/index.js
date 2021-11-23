import { useEffect } from "react";
import usePage from "stores/page";

import Header from "components/header";
import Button from "components/button";
import Histogram from "components/histogram";

import CONSTANTS from "lib/constants";
import { copyButton } from "lib/copy";

let KeyPair = ({ map }) => {
	return (
		<>
			{Object.keys(map).map((key, index) => (
				<div key={index}>
					<b>{key}:</b> {map[key]}
				</div>
			))}
		</>
	);
};

let EditPage = () => {
	let storedPage = {
		label: "Test page by vixalien",
		slug: "test",
		about:
			"This is a test page to see if Rabbet works correctly. If you are seeing this: it does. Thanks! For reports reach out to @vixalien",
		hero: {
			type: "yembed",
			value: "dQw4w9WgXcQ",
		},
		links: [
			{
				label: "Instagram",
				url: "https://instagram.com/angeloverlain",
			},
			{
				label: "Email",
				url: "mailto:hey@vixalien.ga",
			},
		],
	};
	let username = "vixalien";

	let setData = usePage((page) => page.actions.setData);
	useEffect(() => setData(storedPage), [storedPage]);

	let url = CONSTANTS.LINKS.GET_PAGE(username, storedPage.slug);

	return (
		<>
			<main>
				<Header
					title={{
						text: "Page",
						backLink: "/pages/",
						backText: "All pages",
					}}
				/>
				<div>
					<h2>{storedPage.label}</h2>
					<p>{storedPage.about}</p>
					<div>
						<b>Page URL: </b>
						<a
							href={url}
							className="normal"
							target="_blank"
							noopener
							noreferrer
						>
							{url} &#x2197;
						</a>
					</div>
					<br />
					<Button onClick={copyButton} href={url}>
						Copy page URL
					</Button>{" "}
					<Button href={`/pages/${storedPage.slug}/preview`}>
						Preview Page
					</Button>
				</div>
				{/*<div>
					<h2>Analytics</h2>
					<p>Analytics for the last 7 days</p>
					<Histogram
						indices={["Pageviews","Bounce rate"]}
						data={[
							["Sun", 15, 35],
							["Sat", 30, 72],
							["Fri", 15, 40],
							["Thu", 30, 95],
							["Wed", 10, 20],
							["Thu", 90, 10],
						]}
					/>
					<button>More analytics &rarr;</button>
				</div>*/}
				<div>
					<h2>Actions</h2>
					<Button href={`/pages/${storedPage.slug}/edit`}>Edit</Button>{" "}
					<Button href={`/pages/${storedPage.slug}/delete`} delete>
						Delete
					</Button>
				</div>
			</main>
		</>
	);
};

export default EditPage;
