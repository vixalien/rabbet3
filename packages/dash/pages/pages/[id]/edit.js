import { useEffect } from "react";
import usePage from "stores/page";

import Header from "components/header";

import EditPagePartial from "partials/edit_page";

let EditPage = () => {
	let storedPage = {
		label: "Example Label",
		slug: "test_slug",
		about: "Text about text",
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
	let setData = usePage((page) => page.actions.setData);
	useEffect(() => setData(storedPage), [storedPage]);

	return (
		<EditPagePartial
			header={{
				title: {
					text: "Edit Page",
					backLink: `/pages/${storedPage.slug}`,
					backText: "Page",
				},
			}}
			preview={true}
			usePage={usePage}
			onSave={(page) => console.log(page)}
		/>
	);
};

export default EditPage;
