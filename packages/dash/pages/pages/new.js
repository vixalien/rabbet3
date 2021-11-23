import { useEffect } from "react";
import { useRouter } from "next/router";

import useAccount from "stores/account";
import { useEditablePage } from "stores/page";

import EditPagePartial from "partials/edit_page";

import { validateThenCreate } from "lib/validate-then-save";

let NewPage = () => {
	let router = useRouter();
	let account = useAccount();
	let editablePage = useEditablePage();

	useEffect(() => editablePage.actions.setData({ user_uid: account.data.uid, ...editablePage.current }), []);

	let saveToDB = validateThenCreate({
		store: editablePage,
		useStore: useEditablePage,
		validate: () => editablePage.actions.validateAll(),
		name: "Page",
		DB_NAME: "pages",
		onFinishSaving: () => router.push(`/pages/`)
	});

	return (
		<EditPagePartial
			usePage={useEditablePage}
			header={{
				title: {
					text: "New Page",
					backText: "All Pages",
					backLink: "/pages",
				},
			}}
			onSave={saveToDB}
		/>
	);
};

export default NewPage;
