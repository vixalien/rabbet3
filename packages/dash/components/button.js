import cn from "classnames";

import Input from "./input";
import Link from "./link";

let Button = ({
	children = "Button",
	method,
	className,
	href = null,
	data = {},
	outline,
	confirm,
	...props
}) => {
	if (props.noopener) props.noopener = "true";
	if (props.noreferrer) props.noreferrer = "true";
	let c = cn("button", { outline, delete: props.delete }, className);
	delete props.delete;

	if (method) {
		let beforeSubmit = (event) => {
			if (confirm) {
				event.preventDefault();
				if (window.confirm(confirm)) {
					event.target.submit();
				}
			}
		};
		return (
			<form
				action={href}
				method={method}
				style={{ display: "inline" }}
				onSubmit={beforeSubmit}
			>
				{Object.entries(data).map(([key, val], id) => (
					<Input
						key={"input-" + id + "-" + Math.random()}
						hidden
						name={key}
						value={val}
						readOnly
					/>
				))}
				<button type="submit" className={c} {...props}>
					{children}
				</button>
			</form>
		);
	} else if (href && !props.disabled) {
		return (
			<Link href={href} className={c} {...props}>
				{children}
			</Link>
		);
	} else {
		return (
			<button className={c} {...props}>
				{children}
			</button>
		);
	}
};

export default Button;
