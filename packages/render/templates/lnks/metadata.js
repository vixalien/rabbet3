const fs = require("fs");
const path = require("path");
const stylus = require("stylus");

module.exports = async () => {
	let ejsPath = path.resolve(__dirname, 'page.ejs');
	let stylusPath = path.resolve(__dirname, 'style.styl');

	let stylusString = fs.readFileSync(stylusPath, 'utf8');
	let ejsString = fs.readFileSync(ejsPath, 'utf8');

	let compiledStylus = await new Promise((res, rej) => {
		stylus(stylusString)
		  .set('compress', true)
		  .set('filename', 'style.css')
		  .render(function(err, css){
		    if (err) rej(err);
		    res(css);
		  });
	});

	return { compiledStylus, ejsString };
}