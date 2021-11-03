const clp = require("clp")
const path = require('path')
const fs = require('fs')

const stylus = require('stylus')

let args = clp(process.argv);

let OUTPUT_DIR = args.output || args.o;

let CONFIG = {
	TEMPLATES_DIR: path.resolve(__dirname, 'templates'),
	SOURCE_DIR: path.resolve(__dirname, 'src'),
	OUTPUT: path.resolve(OUTPUT_DIR ? path.resolve(process.cwd(), OUTPUT_DIR) : path.resolve(__dirname, 'dist'), 'templates.json'),
}

let ALL_TEMPLATES = fs.readdirSync(CONFIG.TEMPLATES_DIR);

let templates = {};
let baseStylusPath = path.resolve(CONFIG.SOURCE_DIR, 'base.styl');
let baseStylusString = fs.readFileSync(baseStylusPath, 'utf8');

Promise.all(ALL_TEMPLATES.map(async (template)=> {
	let ejsPath = path.resolve(CONFIG.TEMPLATES_DIR, template, 'page.ejs');
	let stylusPath = path.resolve(CONFIG.TEMPLATES_DIR, template, 'style.styl');

	if (!fs.existsSync(stylusPath)) throw `Stylus file for "${template}" is innacessible`;
	if (!fs.existsSync(ejsPath)) throw `EJS file for "${template}" is innacessible`;

	let stylusString = fs.readFileSync(stylusPath, 'utf8');
	let ejsString = fs.readFileSync(ejsPath, 'utf8');

	let compiledStylus = await new Promise((res, rej) => {
		stylus(baseStylusString + '\n' + stylusString)
		  .set('compress', true)
		  .set('filename', 'style.css')
		  .render(function(err, css){
		    if (err) rej(err);
		    res(css);
		  });
	});

	templates[template] = `<div><style>${compiledStylus}</style><div class="link-page">${ejsString}</div></div>`;
}))
	.then(() => {
		let json = JSON.stringify(templates);

		fs.writeFileSync(CONFIG.OUTPUT, json);
	})
	.then(() => console.log("Successfully built templates to: " + CONFIG.OUTPUT))