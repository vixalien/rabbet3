import render from "@rabbet/render";

export default function handler(req, res) {
	let pageString = req.params.page || "",
		page;
	try {
		page = JSON.parse(pageString);
		render(page).then((html) => {
			res.status(200).html(html);
		});
	} catch {
		res.status(400).text("Invalid page data.");
	}
	res.status(200).json({ name: "John Doe" });
}
