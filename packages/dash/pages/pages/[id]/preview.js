import { useRouter } from "next/router";
import { useEffect } from "react";

import Header from "components/header";

import useAccount from "stores/account";
import usePage from "stores/page";
import useOpenable from "stores/openable";

import PreviewPagePartial from "partials/preview_page";

let PreviewPage = () => {
	let router = useRouter();
	let account = useAccount();
	let storedPage = usePage();
	useEffect(() => storedPage.actions.load(account.data.uid, router.query.id), []);

	let header = useOpenable();

	if (storedPage.loading)
		return (
			<>
				<main>
					<Header />
					<h1>Loading Page Preview...</h1>
				</main>
			</>
		);

	return (
		<>
			<main style={{ marginBottom: "0" }}>
				{header.open && (
					<Header
						title={{
							text: "Preview Page",
							backText: "View Page",
							backLink: `/pages/${storedPage.data.slug}`,
							optionText: "Hide Header",
							onOptionClick: header.toggle,
						}}
					/>
				)}
			</main>
			{!header.open && (
				<div className="floating-button-div">
					<div>
						<button onClick={header.toggle}>Show Header</button>
					</div>
				</div>
			)}
			<div>
				<PreviewPagePartial page={storedPage.data} onLoad={event => event.target.style.height = event.target.contentDocument.documentElement.scrollHeight + "px"}/>
			</div>
			<style jsx>{`
				.floating-button-div div {
					position: fixed;
					top: 0;
				}
				.floating-button-div {
					max-width: var(--max-width);
					margin: var(--body-margin);
					display: flex;
					flex-flow: row-reverse;
				}
				.floating-button-div button {
					position: relative;
					margin: 10px;
					background-color: #fff;
				}
			`}</style>
		</>
	);
};

export default PreviewPage;
