import Link from "./link";
import Button from "./button";

let Title = ({
	text = "Title",
	backLink,
	backText = "Back",
	optionText,
	optionHref,
	onOptionClick = () => {},
}) => {
	return (
		<>
			{backLink && (
				<div>
					<br />
					<Link href={backLink}>&larr; {backText}</Link>
					{optionText && (
						<Button
							style={{ float: "right" }}
							onClick={onOptionClick}
							href={optionHref}
						>
							{optionText}
						</Button>
					)}
				</div>
			)}
			<h1>{text}</h1>
			<hr />
		</>
	);
};

export default Title;
