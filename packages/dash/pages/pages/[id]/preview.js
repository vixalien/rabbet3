import Header from "components/header";

import useOpenable from "stores/openable";
import PreviewPagePartial from "partials/preview_page";

let PreviewPage = () => {
	let page = {
		label: "Example Label",
		slug: "test_slug",
		about: "Text about text",
		hero_type: "yembed",
		hero: "1hbz9gehZgs",
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

	let header = useOpenable();

	return (
		<>
			<main style={{ marginBottom: "0" }}>
				{header.open && (
					<Header
						title={{
							text: "Preview Page",
							backText: "View Page",
							backLink: `/pages/${page.slug}`,
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
			<PreviewPagePartial page={page} />
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
