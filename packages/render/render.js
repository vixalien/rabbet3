let ejs = require('./lib/ejs.min.js');

let render = (page, templates, options = {}) => {
	if (!page) throw "no page provided";
	if (!templates) throw "no templates provided";
	let available_templates = Object.keys(templates);

	let template = page.template;
	if (!available_templates.includes(template)) template = available_templates[0];

	let ejsString = templates[template];

	let string = ejs.render(ejsString, { page });
	// add lite youtube stuff
	string = `<script type="module" src="https://unpkg.com/lite-youtube-embed/src/lite-yt-embed.js"></script><link rel="stylesheet" href="https://unpkg.com/lite-youtube-embed/src/lite-yt-embed.css"/>
` + string;
	return string;
}

module.exports = render;