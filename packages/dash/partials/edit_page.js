import { useEffect } from "react";
import cn from "classnames";

import Header from "components/header";
import Input, { Textarea, Select } from "components/input";
import PreviewPagePartial from "./preview_page";

import useOpenable from "stores/openable";

import toast from "lib/toast";

let EditPage = ({
	usePage,
	header = {},
	preview = true,
	saveText = "Save",
	deleteText = "Delete Page",
	onSave = () => {},
}) => {
	let editor = useOpenable();
	let page = usePage((page) => page.data);
	let actions = usePage((page) => page.actions);
	let valid = usePage((page) => page.valid);
	let errors = usePage((page) => page.errors);
	useEffect(() => {
		actions.validate();
	}, [JSON.stringify(page)]);

	let validateThenSavePage = (event) => {
		event.preventDefault();
		actions.validate();
		if (valid) {
			onSave(page);
		} else {
			toast.error("Page data is invalid. Please fix all errors before saving");
		}
	};

	let deletePage = (event) => {
		event.preventDefault();
		onDelete(page);
	};

	// preview is disabled for now
	if (preview) {
		header.title = header.title || {};
		header.title.optionText = editor.open
			? "Hide Live Preview"
			: "Show Live Preview";
		header.title.onOptionClick = editor.toggle;
	}

	return (
		<div className={cn("editor-page", { open: editor.open })} id="editor-page">
			<main>
				<Header {...header} />
				<form>
					<h2>Hero</h2>
					<div>
						<Select
							label="Hero type"
							options={{
								None: "none",
								Image: "image",
								"YouTube embed": "yembed",
							}}
							value={page.hero.type}
							onChange={actions.handleHeroTypeChange()}
							error={errors.hero.type}
						/>
						{page.hero.type == "yembed" ? (
							<Input
								label="YouTube video ID"
								value={page.hero.value}
								onChange={actions.handleHeroChange("yembed")}
								info={
									<>
										For example, <b>dQw4w9WgXcQ</b> is the video ID for{" "}
										<i>
											https://www.youtube.com/watch?v=<b>dQw4w9WgXcQ</b>
										</i>
									</>
								}
								error={errors.hero.value}
							/>
						) : page.hero.type == "image" ? (
							<Input
								label="Select Image file"
								type="file"
								name="image"
								info={
									<>
										Must be: <br />
										- An image file of PNG, JPG, SVG or GIF format. <br />
										- Less than 3 megabytes in size (3MB). <br />
										- Of 1:1 ratio (squared). <br />
										- Atleast 100 pixels in width (not too blurry i.e high
										resolution). <br />
									</>
								}
								accept=".gif,.png,.jpeg,.jpg,.svg,image/gif,image/png,image/jpeg,image/svg+xml"
								onChange={actions.handleHeroChange("image")}
								error={errors.hero.value}
							/>
						) : null}
					</div>
					<h2>Details</h2>
					<div>
						<Input
							label="Label"
							value={page.label}
							onChange={actions.handleChange("label")}
							error={errors.label}
						/>
						<Input
							label="Slug"
							value={page.slug}
							onChange={actions.handleChange("slug")}
							error={errors.slug}
						/>
						<Textarea
							label="About"
							value={page.about}
							onChange={actions.handleChange("about")}
							error={errors.about}
						/>
					</div>
					<h2>Links</h2>
					{errors.links_no && (
						<p style={{ color: "#c50000" }}>
							<b>Note:</b> {errors.links_no}
						</p>
					)}
					<div>
						<button
							onClick={(e) => {
								e.preventDefault();
								actions.addLink();
							}}
						>
							Add Link
						</button>
						<ol className="links">
							{page.links.map((link, index) => {
								let length = page.links.length;
								let linkErrors = errors.links[index] || {};
								return (
									<li key={index}>
										<div className="link">
											<Input
												placeholder="Link label"
												name={"label-" + index}
												onChange={actions.handleLinkChange(index, "label")}
												value={link.label}
												error={linkErrors.label}
											/>
											<Input
												placeholder="URL"
												name="url"
												type={"url-" + index}
												onChange={actions.handleLinkChange(index, "url")}
												value={link.url}
												error={linkErrors.url}
											/>
											<div>
												<button
													onClick={(e) => {
														e.preventDefault();
														actions.moveLinkUp(index);
													}}
													disabled={index === 0}
												>
													&#8593;
												</button>
												&nbsp;
												<button
													onClick={(e) => {
														e.preventDefault();
														actions.moveLinkDown(index);
													}}
													disabled={index === length - 1}
												>
													&#8595;
												</button>
												&nbsp;
												<button
													onClick={(e) => {
														e.preventDefault();
														actions.deleteLink(index);
													}}
													disabled={length === 1}
													className="delete outline"
												>
													Delete
												</button>
											</div>
										</div>
									</li>
								);
							})}
						</ol>
					</div>
					<div>
						<button onClick={validateThenSavePage}>{saveText}</button>
					</div>
				</form>
			</main>
			{editor.open && (
				<aside className="live-view">
					<div className="live-title">
						<span>
							<span className="title">Live Preview</span>{" "}
							<span className="badge">BETA</span>
						</span>{" "}
						<button className="close-live" onClick={editor.hide}>
							Close
						</button>
					</div>
					{/*<Page page={page} account={currentUser}/>*/}
					<div className="live-view-box-html">
						<style jsx>{`
							.live-view-box-html,
							.live-view-box-html::before,
							.live-view-box-html::after,
							.live-view-box-html * .live-view-box-html *::before,
							.live-view-box-html *::after {
								all: revert;
							}
						`}</style>
						<PreviewPagePartial page={page} valid={valid} />
					</div>
				</aside>
			)}
		</div>
	);
};

export default EditPage;
