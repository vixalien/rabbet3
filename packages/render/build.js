const esbuild = require('esbuild');

const clp = require("clp")
const path = require('path')
const fs = require('fs')

const stylus = require('stylus')

let args = clp(process.argv);

let OUTPUT_DIR = args.output || args.o;

let CONFIG = {
	TEMPLATES_DIR: path.resolve(__dirname, 'templates'),
	SOURCE_DIR: path.resolve(__dirname, 'src'),
	OWN_OUTPUT: path.resolve(__dirname, 'dist'),
	OUTPUT: path.resolve(OUTPUT_DIR ? path.resolve(process.cwd(), OUTPUT_DIR) : path.resolve(__dirname, 'dist'), 'templates.json'),
}

let ALL_TEMPLATES = fs.readdirSync(CONFIG.TEMPLATES_DIR);

let str = "";

Promise.all(ALL_TEMPLATES.map(async template => {
	str += `import ${template} from "${path.resolve(CONFIG.TEMPLATES_DIR, template, 'page.js').replace(/\\/g, "//")}";`;

	let metafile = path.resolve(CONFIG.TEMPLATES_DIR, template, 'metadata.js'), metadata;
	if (fs.existsSync(metafile)) {
		metadata = require(metafile);
		if (typeof metadata === "function") metadata = await metadata();
		metadata = JSON.stringify(metadata);
		str += "\n";
		str += `${template}.data = ${metadata}`;
	}

	str += "\n";
}))
	.then(async () => {
		if (str) {
			str += "\n";
			str += `let templates = { ${ALL_TEMPLATES.join(", ")} }\n\n`;
			str += `export default templates`;
		};

		let TEMPF_OUT = path.resolve(CONFIG.OWN_OUTPUT, "all_templates.js");

		// ensure dir exists
		if (!fs.existsSync(path.resolve(CONFIG.OWN_OUTPUT))){
		  fs.mkdirSync(path.resolve(CONFIG.OWN_OUTPUT));
		}
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
			outfile: path.resolve(CONFIG.OWN_OUTPUT, "templates.js")
		};


		await esbuild.build(options)
		fs.unlinkSync(TEMPF_OUT);
		console.log("Built templates successfully")
	});