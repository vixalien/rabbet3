import { useRouter } from "next/router";
import { useEffect } from "react";

import Header from "components/header";

import useAccount from "stores/account";
import usePage, { useEditablePage } from "stores/page";

import validateThenSave from "lib/validate-then-save";

import EditPagePartial from "partials/edit_page";

let EditPage = () => {
	let router = useRouter();
	let account = useAccount();
	let storedPage = usePage();
	let editablePage = useEditablePage();
	useEffect(() => storedPage.actions.load(account.data.uid, router.query.id), []);

	useEffect(() => {
		editablePage.actions.setData(storedPage.data);
	}, [storedPage.loading]);

	let saveToDB = validateThenSave({
		store: editablePage,
		staticStore: storedPage, 
		useStore: useEditablePage,
		validate: () => editablePage.actions.validateAll(),
		name: "Page",
		changed: (current, data) => {
			return JSON.stringify(current) != JSON.stringify(data);
		},
		DB_NAME: "pages",
		updateStore: data => storedPage.actions.setData(data),
		onFinishSaving: () => router.replace(`/pages/${editablePage.current.slug}/edit`, null, { scroll: false })
	});

	if (storedPage.loading || !editablePage.current.slug)
		return (
			<>
				<main>
					<Header />
					<h1>Loading Page...</h1>
				</main>
			</>
		);

	return (
		<EditPagePartial
			header={{
				title: {
					text: "Edit Page",
					backLink: `/pages/${storedPage.data.slug}`,
					backText: "Page",
				},
			}}
			preview={true}
			usePage={useEditablePage}
			onSave={saveToDB}
		/>
	);
};

export default EditPage;
