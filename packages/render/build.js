const fs = require('fs')
const stylus = require('stylus')
const path = require('path')
const esbuild = require('esbuild');
const resolve = require('esbuild-plugin-resolve');

const CONSTANTS = require("./constants");

let ALL_TEMPLATES = fs.readdirSync(CONSTANTS.TEMPLATES_DIR);

let preMetas = path.resolve(CONSTANTS.TEMP_OUTPUT, "pre_metadatas.js");
let postMetas = path.resolve(CONSTANTS.TEMP_OUTPUT, "post_metadatas.js");

let prePages = path.resolve(CONSTANTS.TEMP_OUTPUT, "pre_page.js");
let postPages = path.resolve(CONSTANTS.TEMP_OUTPUT, "post_page.js");

let preTemplates = path.resolve(CONSTANTS.TEMP_OUTPUT, "pre_templates.js");
let postTemplates = path.resolve(CONSTANTS.OWN_OUTPUT, "templates.js");

let preRender = path.resolve(__dirname, "render.js");
let postRender = path.resolve(CONSTANTS.OWN_OUTPUT, "render.js");

let preStylus = path.resolve(CONSTANTS.SOURCE_DIR, 'base.styl');
let postCss = path.resolve(CONSTANTS.OWN_OUTPUT, "main.css");

let globalConfig = {
	plugins: [resolve({
    "react-dom/server": 'react-dom/umd/react-dom-server.browser.production.min.js',
    // react: 'react/umd/react.production.min.js',
  })],
	platform: 'node',
	format: 'cjs',
}

// ensure output dirs exists
if (!fs.existsSync(path.resolve(CONSTANTS.OWN_OUTPUT))){
	fs.mkdirSync(path.resolve(CONSTANTS.OWN_OUTPUT));
}
if (!fs.existsSync(path.resolve(CONSTANTS.TEMP_OUTPUT))){
	fs.mkdirSync(path.resolve(CONSTANTS.TEMP_OUTPUT));
}

// get templates' metadata
let getMetadata = async () => {
	let metaString = "";
	for (let template of ALL_TEMPLATES) {
		let metaPath = path.resolve(CONSTANTS.TEMPLATES_DIR, template, 'metadata.js').replace(/\\/g, "/")
		metaString += `import ${template}MetaFN from "${metaPath}";`
		metaString += "\n";
	}

	metaString += "\n";
	for (let template of ALL_TEMPLATES) {
		metaString += `export let ${template} = ${template}MetaFN()`;
		metaString += "\n";
	}

	fs.writeFileSync(preMetas, metaString);

	const options = {
		...globalConfig,
		entryPoints: [preMetas],
		bundle: true,
		external: ["stylus", "esbuild"],
		minify: false,
		platform: 'node',
		format: 'cjs',
		sourcemap: false,
		loader: {
			'.html': 'text',
			'.css': 'text',
			'.styl': 'text',
			'.js': 'jsx',
			'.jsx': 'jsx',
		},
		outfile: postMetas
	};

	await esbuild.build(options);
	let metadata = require(postMetas);
	let resolvedMeta = {};
	await Promise.all(Object.entries(metadata).map(async ([template]) => {
		resolvedMeta[template] = await metadata[template];
	}));
	return resolvedMeta;
};

let buildPages = async () => {
	let pageString = "";
	for (let template of ALL_TEMPLATES) {
		let pagePath = path.resolve(CONSTANTS.TEMPLATES_DIR, template, 'page.js').replace(/\\/g, "/")
		pageString += `import ${template}Page from "${pagePath}";`
		pageString += "\n";
	}

	pageString += "\n";
	for (let template of ALL_TEMPLATES) {
		pageString += `export let ${template} = ${template}Page`;
		pageString += "\n";
	}

	fs.writeFileSync(prePages, pageString);

	const options = {
		...globalConfig,
		entryPoints: [prePages],
		bundle: true,
		external: ["stylus", "esbuild"],
		minify: false,
		sourcemap: false,
		loader: {
			'.html': 'text',
			'.css': 'text',
			'.styl': 'text',
			'.js': 'jsx',
			'.jsx': 'jsx',
		},
		outfile: postPages
	};

	await esbuild.build(options);
	let page = require(postPages);
	let reolvedPages = {};
	await Promise.all(Object.entries(page).map(async ([template]) => {
		reolvedPages[template] = await page[template];
	}));
	return reolvedPages;
};

let buildTemplates = (metadata) => {
	let metaString = JSON.stringify(metadata, function(key, val) {
	if (typeof val === 'function') {
		return val + ''; // implicitly `toString` it
	}
	return val;
});
	let fn = "";
	fn += `let metadata = ${metaString};\n`;
	fn += `import pages from "${postPages.replace(/\\/g, "/")}";\n`;
	fn += "\n";
	fn += `
let templates = async () => {
	// first resolve all metadata
	let resolvedMeta = {};
	await Promise.all(Object.entries(metadata).map(async ([template]) => {
		resolvedMeta[template] = await metadata[template];
	}));
	// then resolve all pages
	let resolvedPages = {};
	await Promise.all(Object.entries(pages).map(async ([template]) => {
		resolvedPages[template] = await pages[template];
	}));
	for (let template in resolvedMeta) {
		resolvedPages[template].data = resolvedMeta[template];
	};
	return resolvedPages;
}

export default templates;`;
	fs.writeFileSync(preTemplates, fn);
	const options = {
		...globalConfig,
		entryPoints: [preTemplates],
		bundle: true,
		external: ["stylus", "esbuild"],
		minify: true,
		globalName: 'templates',
		sourcemap: false,
		loader: {
			'.html': 'text',
			'.css': 'text',
			'.styl': 'text',
			'.js': 'jsx',
			'.jsx': 'jsx',
		},
		outfile: postTemplates
	};

	return esbuild.build(options);
}

let buildRender = async => {
	const options = {
		...globalConfig,
		entryPoints: [preRender],
		bundle: true,
		minify: true,
		platform: "node",
		format: "cjs",
		loader: {
			'.html': 'text',
			'.css': 'text',
			'.jsx': 'jsx',
		},
		outfile: postRender
	};

	return esbuild.build(options);
}

const buildStylus = async () => {
	let stylusString = fs.readFileSync(preStylus, 'utf8');
	let mainStylus = await new Promise((res, rej) => {
		stylus(stylusString)
			.set('compress', true)
			.set('filename', 'style.css')
			.render(function(err, css){
				if (err) rej(err);
				res(css);
			});
	})
		.then(stylus => {
			return fs.writeFileSync(postCss, stylus);
		})
	return mainStylus;
}

console.log("Building @rabbet/render");
getMetadata()
	.then(metadata => {
		console.log("Got metadata")
		return buildPages()
			.then(() => console.log("Built pages"))
			.then(() => buildTemplates(metadata))
			.then(() => console.log("Built templates"))
	})
	.then(() => buildStylus())
	.then(() => console.log("Built css"))
	.then(() => buildRender())
	.then(() => console.log("Built render script"))
	.finally(() => {
		try { fs.unlinkSync(CONSTANTS.TEMP_OUTPUT) } catch {};
		console.log("Successfully built @rabbet/render");
	})