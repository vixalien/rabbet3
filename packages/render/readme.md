# Rabbet render

This package provide methods to render Rabbet pages into actually usable HTML according to a selected template.

## build

This script builds the actual templates from the `templates` folder into a `templates.json` file at your specified output directory.
This is a CLI option.

```sh
yarn build -o ./dist
```

**options**

- **`o|output`** shows where to put built file. Otherwise store them in the `dist` folder in **THIS** package's directory.

## render

This scripts renders provided page data into HTML according to a selected template.
Please note that is not a CLI but a JS LIB (it is also the default export).

**code**

```js
let render = require('render');

page = {
	label: "Hello",
}

templates = someHowGetBuiltTemplates();

render(page, templates, options = {});
```

**options**

- **`page`** saved rabbet page data object.
- **`templates`** built templates object (NOT JSON).
- **`options`** currently useless right now.