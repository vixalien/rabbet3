const path = require('path');
const fs = require('fs');
const express = require('express')
var url = require('url');
const app = express();

const render = require("@rabbet/render");
const firestore = require('../lib/firestore');

const port = process.env.PORT || 3001;

function fullUrl(req) {
	return url.format({
		protocol: req.protocol,
		host: req.get('host'),
		pathname: req.originalUrl
	});
}

// because on Vercel: ignored
// app.use(express.static('public'));

app.get('/p/:username/:slug', async (req, res, next) => {
	let url = fullUrl(req);
	let username = req.params.username;
	let slug = req.params.slug;

	if (!username || !slug) return next();

	// fetch user & page
	// test username = vixalien
	// test slug = test
	let user = await firestore.query("users", ["username", "==", username]).then(e => e[0])
	if (user) {
		let page = await firestore.query("pages", ["user_uid", "==", user._id], ["slug", "==", slug]).then(e => e[0])
		if (page) {
			// render the page
			res.setHeader('Content-Type', 'text/html');
			return render(page.fields)
				.then(html => res.send(html));
		} else {
			return next();
		}
	} else {
		return next();
	}
})

app.get('/:slug', async (req, res, next) => {
	let url = fullUrl(req);
	let username = req.subdomains[0];
	let slug = req.params.slug;

	if (!username || !slug) return next();

	// fetch user & page
	// test username = vixalien
	// test slug = test
	let user = await firestore.query("users", ["username", "==", username]).then(e => e[0])
	if (user) {
		let page = await firestore.query("pages", ["user_uid", "==", user._id], ["slug", "==", slug]).then(e => e[0])
		if (page) {
			// render the page
			res.setHeader('Content-Type', 'text/html');
			return render(page.fields)
				.then(html => res.send(html));
		} else {
			return next();
		}
	} else {
		return next();
	}
})

app.get('/', (req, res) => {
	// redirect to rabbet dash
	res.redirect("https://dash.rabbet.me");
})

app.use(function (req, res, next) {
	res.status(404);
	return fs.createReadStream(path.resolve(__dirname, "../public/404.html")).pipe(res);
})

app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`)
})
