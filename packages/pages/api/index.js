const express = require('express')
var url = require('url');
const app = express();

const render = require("@rabbet/render");
const firestore = require('../lib/firestore');
const templates = require("../dist/templates");

const port = process.env.PORT || 3001;

function fullUrl(req) {
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: req.originalUrl
  });
}

app.get('/p/:username/:slug', async (req, res, next) => {
  // let url = fullUrl(req);
  // let subdomain = req.subdomains[0];
  let username = req.params.username;
  let slug = req.params.slug;

  // fetch user & page
  // test username = vixalien
  // test slug = test
  let user = await firestore.find("users", s => s.where("username", "==", username))
  if (user.exists) {
    let userData = await user.get();
    let page = await firestore.find("pages", s => s.where("user_uid", "==", userData._id).where("slug", "==", slug))
    if (page.exists) {
      let pageData = await page.get();
      // render the page
      res.setHeader('Content-Type', 'text/html');
      return res.send(render(pageData, templates));
    } else {
      next();
    }
  } else {
    next();
  }
})

app.get('/', (req, res) => {
  // return to main page
  res.send('Main Page!');
})

app.use(function (req, res, next) {
  res.status(404).send("404!")
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})