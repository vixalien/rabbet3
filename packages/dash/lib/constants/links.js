let META = {
	PROTOCOL: "https://",
	HOST: "rabbet.me",
	SUBDOMAINS: true,
};

let LINKS = {
	GET_PAGE(username, slug) {
		if (META.SUBDOMAINS)
			return `${META.PROTOCOL}${username}.${META.HOST}/${slug}`;
		else return `${META.PROTOCOL}${META.HOST}/p/${username}/${slug}`;
	},
};

export default LINKS;
