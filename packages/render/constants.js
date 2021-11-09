const path = require('path')

let CONFIG = {
	TEMPLATES_DIR: path.resolve(__dirname, 'templates'),
	SOURCE_DIR: path.resolve(__dirname, 'src'),
	OWN_OUTPUT: path.resolve(__dirname, 'dist'),
}

module.exports = CONFIG;