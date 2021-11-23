let META = {
	PROTOCOL: "https://",
	HOST: "rabbet3.vercel.app",
	SUBDOMAINS: false,
};

let LINKS = {
	GET_PAGE(username, slug) {
		if (META.SUBDOMAINS)
			return `${META.PROTOCOL}${username}.${META.HOST}/${slug}`;
		else return `${META.PROTOCOL}${META.HOST}/p/${username}/${slug}`;
	},
};

export default LINKS;
