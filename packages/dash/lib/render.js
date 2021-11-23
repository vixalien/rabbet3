import render from "@rabbet/render";
// import templates from "templates/templates";

let r = (page = {}, ...data) => {
	return render(page, ...data);
};

export default r;
