let fs = require('fs');
let path = require('path');
let stylus = require('stylus');
let ejs = require('./lib/ejs.js');

const CONSTANTS = require("./constants");

let templateFile = fs.readFileSync(path.resolve(__dirname, 'src', 'template.html'), 'utf8');

let generateDefaultMetaData = (page) => {
	return {
		title: page.label + ' - rabbet',
		scripts: [],
		links: [],
		styles: [],
		html: "",
	};
}

const isValidURL = (s) => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};


const loadStylus = async () => {
	return fs.readFileSync(path.resolve(CONSTANTS.OWN_OUTPUT, "main.css"), "utf8");
}

let hydratePage = ({ meta, page, templateFile, mainStylus }) => {
	meta.styles = [mainStylus,...meta.styles];
	let objToAttr = obj => Object.entries(obj).map(a => a[1] ? `${a[0]}="${a[1]}"` : "").join(" ");
	let link = data => {
		if (typeof data == "string") data = { href: data };
		data.rel = data.rel || "stylesheet";
		return `<link ${objToAttr(data)}>`
	}
	let script = data => {
		if (typeof data == "string") data = isValidURL(data) ? ({ src: data }) : ({ html: data });
		data.defer = "defer";
		let html = data.html || "";
		delete data.html;
		return `<script ${objToAttr(data)}>${html}</script>`
	}
	let style = data => {
		if (typeof data == "string") data = ({ html: data });
		let html = data.html || "";
		delete data.html;
		return `<style ${objToAttr(data)}>${html}</style>`
	}
	return templateFile
		.replace('<!-- PAGE-TITLE -->', meta.title)
		.replace('<!-- PAGE-DESC -->', page.about)
		.replace('<!-- PAGE-LINKS -->', meta.links.map(li => link(li)).join("\n"))
		.replace('<!-- PAGE-SCRIPTS -->', meta.scripts.map(scr => script(scr)).join("\n"))
		.replace('<!-- PAGE-STYLES -->', meta.styles.map(styl => style(styl)).join("\n"))
		.replace('<!-- PAGE-CONTENT -->', `<div class="link-page">${meta.html}</div>`)
}

let render = async (page, options = {}, templates /* = require(path.resolve(__dirname, "dist", "templates.js")).default */) => {
	return "contents of dist folder" + fs.readdirSync(path.resolve(__dirname, "../.." )).join(", ");
	if (!page) throw "no page provided";
	if (!templates) throw "no templates provided";
	let available_templates = Object.keys(templates);

	let template = page.template;
	if (!available_templates.includes(template)) template = available_templates[0];

	let selectedTemplate = templates[template];

	let defaultMeta = generateDefaultMetaData(page);
	let meta = { ...defaultMeta, ...selectedTemplate.render(page, selectedTemplate) };
	let mainStylus = await loadStylus();

	// add lite youtube stuff
	return hydratePage({ meta, page, templateFile, mainStylus });
}

module.exports = render;