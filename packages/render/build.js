const esbuild = require('esbuild');

const path = require('path')
const fs = require('fs')

const stylus = require('stylus')

const CONSTANTS = require("./constants");

let ALL_TEMPLATES = fs.readdirSync(CONSTANTS.TEMPLATES_DIR);

let str = "";

const loadStylus = async () => {
	let stylusPath = path.resolve(__dirname, 'src', 'base.styl');
	let stylusString = fs.readFileSync(stylusPath, 'utf8');
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
			let CSS_OUT = path.resolve(CONSTANTS.OWN_OUTPUT, "main.css");

			return fs.writeFileSync(CSS_OUT, stylus);
		})
	return mainStylus;
}

// ensure output dir exists
if (!fs.existsSync(path.resolve(CONSTANTS.OWN_OUTPUT))){
  fs.mkdirSync(path.resolve(CONSTANTS.OWN_OUTPUT));
}

loadStylus()
	.then(() => {
		return Promise.all(ALL_TEMPLATES.map(async template => {
			str += `import ${template} from "${path.resolve(CONSTANTS.TEMPLATES_DIR, template, 'page.js').replace(/\\/g, "//")}";`;

			let metafile = path.resolve(CONSTANTS.TEMPLATES_DIR, template, 'metadata.js'), metadata;
			if (fs.existsSync(metafile)) {
				metadata = require(metafile);
				if (typeof metadata === "function") metadata = await metadata();
				metadata = JSON.stringify(metadata);
				str += "\n";
				str += `${template}.data = ${metadata}`;
			}

			str += "\n";
		}));
	})
	.then(async () => {
		if (str) {
			str += "\n";
			str += `let templates = { ${ALL_TEMPLATES.join(", ")} }\n\n`;
			str += `export default templates`;
		};

		let TEMPF_OUT = path.resolve(CONSTANTS.OWN_OUTPUT, "all_templates.js");

		fs.writeFileSync(TEMPF_OUT, str);

		// NOW BUILDING
		let external = fs.readdirSync('node_modules');
		external.push("stylus");
		const options = {
			entryPoints: [TEMPF_OUT],
			bundle: true,
			external,
			minify: true,
			platform: 'node',
			format: 'cjs',
			outfile: path.resolve(CONSTANTS.OWN_OUTPUT, "templates.js")
		};


		await esbuild.build(options)
		fs.unlinkSync(TEMPF_OUT);
		console.log("Built templates successfully to:", path.resolve(CONSTANTS.OWN_OUTPUT, "templates.js"))
	});