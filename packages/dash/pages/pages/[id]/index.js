import { useRouter } from "next/router";
import { useEffect } from "react";

import useAccount from "stores/account";
import usePage from "stores/page";

import Header from "components/header";
import Button from "components/button";
import Histogram from "components/histogram";

import CONSTANTS from "lib/constants";
import { copyButton } from "lib/copy";
import toast from "lib/toast";

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
	const router = useRouter();
	let account = useAccount();
	let storedPage = usePage();
	useEffect(() => storedPage.actions.load(account.data.uid, router.query.id), []);

	let url = CONSTANTS.LINKS.GET_PAGE(account.data.username, storedPage.data.slug);

	if (storedPage.loading)
		return (
			<>
				<main>
					<Header />
					<h1>Loading Page...</h1>
				</main>
			</>
		);

	if (!storedPage.data)
		return (
			<>
				<main>
					<Header />
					<h1>No page with given slug found</h1>
				</main>
			</>
		);

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
					<h2>{storedPage.data.label}</h2>
					<p>{storedPage.data.about}</p>
					<div>
						<b>Page URL: </b>
						<a
							href={url}
							className="normal"
							target="_blank"
							rel="noopener noreferrer"
						>
							{url} &#x2197;
						</a>
					</div>
					<br />
					<Button onClick={copyButton} href={url}>
						Copy page URL
					</Button>{" "}
					<Button href={`/pages/${storedPage.data.slug}/preview`}>
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
					<Button href={`/pages/${storedPage.data.slug}/edit`}>Edit</Button>{" "}
					<Button delete onClick={e => {
						e.preventDefault();
						toast.promise(storedPage.actions.delete()
							.then(() => router.push("/pages"))
						, {
							loading: "Deleting page...",
							success: "Successfully deleted page",
							error: "There was an error deleting the page. Are you offline?"
						});
					}}>
						Delete
					</Button>
				</div>
			</main>
		</>
	);
};

export default EditPage;
