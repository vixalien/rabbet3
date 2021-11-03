let b = (string) => 
	typeof window == "undefined"
		? Buffer.from(string).toString("base64")
		: window.btoa(string);

let a = (string) => 
	typeof window == "undefined"
		? Buffer.from(string, "base64").toString("binary")
		: window.atob(string);

module.exports = b;

module.exports.atob = a;
