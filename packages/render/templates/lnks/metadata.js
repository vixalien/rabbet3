const jsFn = require("./page.jsx").default;
const cssString = require('./style.css');

const fs = require("fs");
const path = require("path");

module.exports = async () => {
	return { cssString, jsFn };
}