import { memo, useEffect } from "react";
import render from "lib/render";

import usePromise from "stores/promise";

let MinimalPreviewPage = ({ page, valid = true }) => {
	if (!valid) {
		return <main>Page data is invalid</main>;
	}

	let url = "";
	let renderedHTML = usePromise();

	useEffect(() => {
		if (typeof window != "undefined") {
			renderedHTML.use(render(page));
		}
	}, [JSON.stringify(page)]);

	if (renderedHTML.loading) {
		return <main>Loading Page Preview...</main>;
	} else if (renderedHTML.threw) {
		return <main>Preview page couldn't be created.</main>;
	} else {
		let file = new File([renderedHTML.value], "page.html", {
			type: "text/html",
		});
		url = URL.createObjectURL(file);
		return <iframe className="preview-iframe" src={url} />;
	}
};

let MemoizedMPP = memo(MinimalPreviewPage, (a, b) => {
	console.log(JSON.stringify(a) === JSON.stringify(b), b);
	return JSON.stringify(a) === JSON.stringify(b);
});

export default MemoizedMPP;
