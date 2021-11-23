import usePage from "stores/page";

import EditPagePartial from "partials/edit_page";

let NewPage = () => {
	return (
		<EditPagePartial
			usePage={usePage}
			header={{
				title: {
					text: "New Page",
					backText: "All Pages",
					backLink: "/pages",
				},
			}}
		/>
	);
};

export default NewPage;
