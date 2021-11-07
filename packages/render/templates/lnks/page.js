import fs from "fs";
import path from "path";

import ejs from "../../lib/ejs";
import stylus from "../../lib/stylus";

let render = (page, meta) => {
	let config = {
		title: page.label + ' - rabbet',
		scripts: [],
		links: [],
		styles: [],
	};
	if (page.hero.type == "yembed") {
		config.links.push("https://unpkg.com/lite-youtube-embed/src/lite-yt-embed.css");
		config.scripts.push({
			src: "https://unpkg.com/lite-youtube-embed/src/lite-yt-embed.js",
			type: "module"
		});
	};

	config.html = ejs.render(meta.data.ejsString, { page });
	config.styles.push(meta.data.compiledStylus);
	return config;
}

let meta = {
	"label": "lnks",
	"settings": [
		{
			"key": "show_rabbet",
			"label": "Show Powered by Rabbet",
			"description": "Show the text 'Powered by Rabbet' at the end of the page.",
			"type": "boolean",
			"default": true,
		}
	],
	render,
};

export default meta;