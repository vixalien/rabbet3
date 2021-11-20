const React = require("react");
const ReactDOMServer = require("react-dom/server");

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

	globalThis.React = React;
	let Element = Function("return" + meta.data.jsFn)();
	config.html = ReactDOMServer.renderToStaticMarkup(Element({ page }));
	config.styles.push(meta.data.cssString);
	return config;
}

let template = {
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

export default template;